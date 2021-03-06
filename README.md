#Gardendoor Plugin
A script to open a Garden Door with Siri / HomeKit. "Hey Siri... Open the [GardenDoor]" opens the door for 4 secounds.

###Requirements:
-  Raspberry Pi 
-  Relay connected to Pin 7 (default configuration)

###Installation on a fresh Raspberry Pi 2 running Debian ≥ 8:
    > sudo su
    > apt install -y curl
    > curl -sL https://raw.githubusercontent.com/AndreasPrang/pastebin/master/Garden%20Door%20Opener%20-%20Raspberry%20PI/GardenDoorSetupRPi.sh | bash -
    
    Connect the Relay on Pin 7, 5V and GND.
    > homebridge

Example config.json:
```JSON
{
    "bridge": {
        "name": "Raspberry Pi 2",
        "username": "CC:22:3D:E3:CE:32",
        "port": 51826,
        "pin": "031-45-154"
    },

    "accessories": [
        {
                "accessory": "GDOOR",
                "name": "GPIO4",
                "pin": 7,
                "duration": 4000
        }
    ],

    "platforms": [
    ]
}

```

This plugin supports doors controlled relay connected to an Raspberry Pi.
