# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Fixed

- Export the `TimeoutError` class instead of only the type declaration, and remove the non-documented export of `timedPromise`
- Remove unused dev dependencies (`prettier-plugin-tailwindcss`)

## Changed

- Regroup all types in a single types.d.ts file
- Remove the build step from the preview command

## v1.0.1 [2025-08-25]

### Changed

- Bumps svelte from 5.38.2 to 5.38.3.
- Make the demo application reactive

## v1.0.0 [2025-08-24]

### Added

- Add documentation
- Add a demo application
- Implement a scoped PCI loader
- Implement a PCI registry
- Implement a scoped AMD loader on top of SystemJS
- Project's bootstrap.
