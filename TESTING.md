# Manual test checklist (Foundry v13)

Environment: Foundry **13.341+**, **socketlib 1.1.3+**, module built to `Data/modules/anarchist-overlay`.

Copy `dist/` contents (or symlink) into the module folder, enable **socketlib** and **anarchist-overlay**, reload the world.

| ID | Test | Expected | PASS / FAIL | Notes |
|----|------|----------|-------------|-------|
| T1 | README macro (text crawl + overlay) | Animation on all connected clients | | |
| T2 | `aboveUi: true`, actor sheet open before macro | Overlay covers UI; clicks blocked when `blockInteractions: true` | | |
| T3 | `aboveUi: false` | Overlay under UI; canvas usable if `blockInteractions: false` | | |
| T4 | `closeAllWindows: true` (default) | Actor/item/journal sheets close before overlay; **sidebar and HUD stay visible** | | |
| T4b | `hideUi: true` | Sidebar/chat/hotbar hidden during overlay; **UI returns** after `closeTime` / fade | | |
| T9 | `centerMap: true` | Canvas pans so map center is on screen (all clients); zoom unchanged | | |
| T5 | Run `createOverlay` twice quickly | Only one overlay visible | | |
| T6 | `closeTime` + `fadeOnClose` | Overlay removes after timeout with fade | | |
| T7 | Glitch effect macro | No CSS regression | | |
| T8 | Browser console (F12) | No errors on world load or macro run | | |

If any test fails, note the ID in a GitHub issue and apply a targeted fix (see plan: filter `closeAllWindows`, adjust `MIN_ABOVE_UI_Z`, etc.).
