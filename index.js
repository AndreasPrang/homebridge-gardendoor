var rpio = require('rpio');
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-gpio', 'GPIO', LockitronAccessory);
}

function LockitronAccessory(log, config) {
    this.log = log;
    this.name = config['name'];
    this.pin = config['pin'];
    this.duration = config['duration'];
    this.service = new Service.LockMechanism(this.name);

    if (!this.pin) throw new Error('You must provide a config value for pin.');

    this.service
    .getCharacteristic(Characteristic.LockCurrentState)
    .on('get', this.getState.bind(this));

    this.service
    .getCharacteristic(Characteristic.LockTargetState)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

LockitronAccessory.prototype.getServices = function() {
    return [this.service];
}

LockitronAccessory.prototype.getState = function(callback) {
        this.log("Getting current state...");

        rpio.open(this.pin, rpio.OUTPUT);

        var on = rpio.read(this.pin)
        callback(null, on);
        console.log('Pin ' + this.pin + ' is currently set ' + (rpio.read(this.pin) ? 'high' : 'low'));
}

LockitronAccessory.prototype.setState = function(state, callback) {
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

LockitronAccessory.prototype.pinAction = function(action) {
        this.log('Turning ' + (action == 0 ? 'on' : 'off') + ' pin #' + this.pin);

        var self = this;
        rpio.open(this.pin, rpio.OUTPUT);
        rpio.write(this.pin, action == 0 ? rpio.LOW : rpio.HIGH);
}

LockitronAccessory.prototype.pinTimer = function() {
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
