# Changelog

All notable changes to this project will be documented in this file.

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
