# Changelog

All notable changes to this project will be documented in this file.

## [1.2.3] - 2026-03-01

### Fixed
- Removed `node-libgpiod` from npm dependencies entirely so that
  `npm install homebridge-gardendoor` no longer triggers a native
  compilation step and never produces `gpiod.h: No such file or directory`
  errors in the Homebridge install log.
- Added a pure-JavaScript sysfs GPIO fallback (`/sys/class/gpio/`) that is
  used automatically when `node-libgpiod` is not present.  This keeps the
  plugin fully functional on Raspberry Pi 3/4 (`chip: 0`) without any
  additional system packages.
- Raspberry Pi 5 users (`chip: 4`) who need libgpiod support now receive a
  clear, actionable error message at startup explaining which packages to
  install (`libgpiod-dev`) and how to re-install the plugin.

## [1.2.1] - 2026-03-01

### Fixed
- Moved `node-libgpiod` to `optionalDependencies` so that `npm install` no longer aborts when the
  `libgpiod-dev` system headers are not present. The plugin now reports a clear actionable error at
  startup if the native addon could not be compiled, instructing the user to run
  `sudo apt install libgpiod-dev` and then reinstall the plugin.

## [1.2.0] - 2026-03-01

### Changed
- Replaced deprecated `rpio` library with `node-libgpiod` for Node.js v22 compatibility
- Updated minimum Node.js requirement to v18
- Updated npm publish workflow to use `actions/checkout@v4`, `actions/setup-node@v4`, and Node.js 20.x

### Added
- GPIO chip/line initialisation error handling with descriptive error messages
- Pin number validation (must be a positive integer)
- BCM pin numbering clarification in README and config schema

### Fixed
- Plugin compatibility with modern versions of Node.js (v18+)

## [1.1.0] - 2022-12-07

### Added
- Config schema (`config.schema.json`) for Homebridge UI configuration

## [1.0.1] - 2022-12-06

### Fixed
- Minor fixes

## [1.0] - 2016-09-29

### Added
- Initial release: relay-controlled door lock accessory for Homebridge
