# Httpdoor Plugin

Example config.json:
```JSON
	{
		"accessories": [{
			"accessory": "Httpdoor",
			"name": "Garage Door",
			"controlURL": "your-control-custom-url",
			"statusURL": "your-status-custom-url",
		}]
	}
```

This plugin supports doors controlled by any custom HTTP endpoint via GET (to get state, either "open" or "closed"), and POST (to set new state, same two values).
