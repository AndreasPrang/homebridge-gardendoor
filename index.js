var fs = require('fs');

// SysfsLine: pure-JS GPIO via the Linux sysfs interface (/sys/class/gpio).
// Used as a fallback when node-libgpiod is not installed.  Works on
// Raspberry Pi 3/4 (gpiochip0).  The sysfs interface uses the same BCM
// line-offset numbers as libgpiod, so existing config values are compatible.
function SysfsLine(pin) {
    this.gpioPath = '/sys/class/gpio/gpio' + pin;

    if (!fs.existsSync(this.gpioPath)) {
        fs.writeFileSync('/sys/class/gpio/export', String(pin));
        // Wait up to 1 s for the kernel to create the sysfs entry.
        // Use Atomics.wait for a non-spinning 10 ms sleep between checks.
        var _sa = new Int32Array(new SharedArrayBuffer(4));
        var deadline = Date.now() + 1000;
        while (!fs.existsSync(this.gpioPath + '/direction')) {
            if (Date.now() >= deadline) {
                throw new Error(
                    'Timed out waiting for /sys/class/gpio/gpio' + pin + '/direction to appear. ' +
                    'Make sure the homebridge user is a member of the gpio group:\n' +
                    '  sudo usermod -a -G gpio homebridge'
                );
            }
            Atomics.wait(_sa, 0, 0, 10);
        }
    }

    fs.writeFileSync(this.gpioPath + '/direction', 'out');
}

SysfsLine.prototype.getValue = function() {
    return parseInt(fs.readFileSync(this.gpioPath + '/value', 'utf8').trim(), 10);
};

SysfsLine.prototype.setValue = function(value) {
    fs.writeFileSync(this.gpioPath + '/value', String(value));
};

var Chip, Line;
try {
    var gpiod = require('node-libgpiod');
    Chip = gpiod.Chip;
    Line = gpiod.Line;
} catch (e) {
    // node-libgpiod is not installed; SysfsLine will be used for chip 0.
}
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-gpio', 'GDOOR', GardenDoorAccessory);
}

function GardenDoorAccessory(log, config) {
    this.log = log;
    this.name = config['name'];
    this.pin = config['pin'];
    this.duration = config['duration'];
    this.chipNumber = config['chip'] !== undefined && config['chip'] !== null ? config['chip'] : 0;
    this.service = new Service.LockMechanism(this.name);

    if (this.pin === undefined || this.pin === null) throw new Error('You must provide a config value for pin.');

    if (Chip && Line) {
        // node-libgpiod is available (user installed it manually or it was
        // already present on the system).  Supports all chips including Pi 5.
        try {
            this.chip = new Chip(this.chipNumber);
            this.line = new Line(this.chip, this.pin);
            this.line.requestOutputMode();
            this.line.setValue(1);
        } catch (err) {
            throw new Error('Failed to initialize GPIO pin ' + this.pin + ' on chip ' + this.chipNumber + ': ' + err.message);
        }
    } else if (this.chipNumber === 0) {
        // Sysfs fallback – works on Raspberry Pi 3/4 without any native addon.
        try {
            this.line = new SysfsLine(this.pin);
            this.line.setValue(1);
        } catch (err) {
            throw new Error(
                'Failed to initialize GPIO pin ' + this.pin + ' via sysfs: ' + err.message
            );
        }
    } else {
        throw new Error(
            'GPIO chip ' + this.chipNumber + ' requires node-libgpiod (e.g. Raspberry Pi 5).\n' +
            'Install the system library first, then reinstall the plugin:\n' +
            '  sudo apt install libgpiod-dev\n' +
            '  npm install --save homebridge-gardendoor'
        );
    }

    this.service
    .getCharacteristic(Characteristic.LockCurrentState)
    .on('get', this.getState.bind(this));

    this.service
    .getCharacteristic(Characteristic.LockTargetState)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

GardenDoorAccessory.prototype.getServices = function() {
    return [this.service];
}

GardenDoorAccessory.prototype.getState = function(callback) {
        this.log("Getting current state...");

        var on = this.line.getValue();
        callback(null, on);
        this.log('Pin ' + this.pin + ' is currently set ' + (on ? 'high' : 'low'));
}

GardenDoorAccessory.prototype.setState = function(state, callback) {
  var lockitronState = (state == Characteristic.LockTargetState.SECURED) ? "lock" : "unlock";

  this.log("Set state to %s", lockitronState);

    if (state == Characteristic.LockTargetState.UNSECURED) {
        this.pinAction(0);
                if (is_defined(this.duration) && is_int(this.duration)) {
                        this.pinTimer()
                }
                callback(null);
    } else {
                this.pinAction(1);
                callback(null);
    }
}

GardenDoorAccessory.prototype.pinAction = function(action) {
        this.log('Turning ' + (action == 0 ? 'on' : 'off') + ' pin #' + this.pin);

        this.line.setValue(action == 0 ? 0 : 1);
}

GardenDoorAccessory.prototype.pinTimer = function() {
        var self = this;
        setTimeout(function() {
                        self.pinAction(1);
        }, this.duration);
}

var is_int = function(n) {
   return n % 1 === 0;
}

var is_defined = function(v) {
        return typeof v !== 'undefined';
}
