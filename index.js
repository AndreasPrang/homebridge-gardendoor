var { Chip, Line } = require('node-libgpiod');
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
    this.chipNumber = config['chip'] || 0;
    this.service = new Service.LockMechanism(this.name);

    if (!this.pin) throw new Error('You must provide a config value for pin.');

    this.chip = new Chip(this.chipNumber);
    this.line = new Line(this.chip, this.pin);
    try {
        this.line.requestOutputMode();
        this.line.setValue(1);
    } catch (err) {
        throw new Error('Failed to initialize GPIO pin ' + this.pin + ' on chip ' + this.chipNumber + ': ' + err.message);
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
        console.log('Pin ' + this.pin + ' is currently set ' + (on ? 'high' : 'low'));
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
