#Gardendoor Plugin
A script to open a Garden Door with Siri / HomeKit. "Hey Siri... Open the [GardenDoor]" opens the door for 4 secounds.

###Requirements:
-  Raspberry Pi 
-  Relay connected to GPIO4 (BCM/libgpiod line offset 4, physical header pin 7)
-  Node.js >= 18

###Installation on a fresh Raspberry Pi running Debian ≥ 11:
    > sudo su
    > apt install -y curl
    > curl -sL https://raw.githubusercontent.com/AndreasPrang/pastebin/master/Garden%20Door%20Opener%20-%20Raspberry%20PI/GardenDoorSetupRPi.sh | bash -
    
    Connect the Relay on GPIO4 (BCM line offset 4, physical pin 7), 5V and GND.
    > homebridge

**Note for Raspberry Pi 5 users:** The plugin uses the sysfs GPIO interface for chip 0 (Pi 3/4) without any extra system packages. For Raspberry Pi 5 (`"chip": 4`), install `libgpiod-dev` and `node-libgpiod` before installing the plugin:

    sudo apt install libgpiod-dev
    npm install --save homebridge-gardendoor

Example config.json:
```JSON
{
    "bridge": {
        "name": "Raspberry Pi",
        "username": "CC:22:3D:E3:CE:32",
        "port": 51826,
        "pin": "031-45-154"
    },

    "accessories": [
        {
                "accessory": "GDOOR",
                "name": "GPIO4",
                "pin": 4,
                "chip": 0,
                "duration": 4000
        }
    ],

    "platforms": [
    ]
}

```

**Note:** For Raspberry Pi 5, set `"chip": 4` in your config. Older models (Pi 3/4) use the default `"chip": 0` and work with the built-in sysfs GPIO fallback (no extra system packages needed).

This plugin supports doors controlled relay connected to an Raspberry Pi.
