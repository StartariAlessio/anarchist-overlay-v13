# Changelog

## 1.0.3

### Added

- `centerMap` / `centerMapDuration` overlay options: animate canvas pan to center the scene map on the viewport when the overlay starts (synced to all clients).

### Fixed

- `centerMap` used stage-translation math for `animatePan`, but Foundry v13 expects pivot/world coordinates (`stage.pivot`), which pushed the view to the top-left. Now pans to the center of `sceneRect`.
- `centerMap` runs after `hideUi` so the viewport size is correct when the sidebar is hidden.

## 1.0.2

### Added

- `hideUi` overlay option: hides Foundry UI with CSS (`body.anarchist-hide-ui`) and restores it when the overlay is removed (no `Application.close()` on core UI).

## 1.0.1

### Fixed

- `closeAllWindows` no longer closes Foundry core UI (sidebar, HUD, chat). Only `DocumentSheetV2` and legacy `ui.windows` pop-outs are closed.

## 1.0.0

**Breaking:** Foundry VTT v13 only. Not compatible with v12 or earlier.

### Requirements

- Foundry VTT 13.341+
- socketlib 1.1.3+

### Changed

- Migrated to Foundry v13 APIs (`foundry.applications.handlebars.renderTemplate`, `foundry.utils.parseHTML`, `foundry.applications.instances` for closing windows).
- Manifest uses `id`, `compatibility`, and `relationships.requires` for socketlib.
- `closeAllWindows` runs before the overlay is shown (cleaner briefing flow).
- Previous `.anarchist-overlay` elements are removed when starting a new overlay.
- `aboveUi` uses dynamic z-index with a minimum floor (`100000`) so the overlay stays above the UI after windows are closed.

### Fixed

- Release zip no longer references a non-existent `languages/` folder.

## 0.2.0 and earlier

Foundry v9–10 era builds. Use the last pre-1.0.0 release if you remain on Foundry v12.
