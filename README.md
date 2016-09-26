#Gardendoor Plugin

###Requirements:
-  Raspberry Pi 

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
                "accessory": "GPIO",
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
