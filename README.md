# Anarchist Overlay

Module for the Foundry VTT, allowing to render arbitrary HTML in a configurable overlay above the canvas for all users simultaneously. It also includes a method for getting HTML for mission briefing-like text crawl.

## Requirements

- Foundry VTT **13.341** or newer (v13 only)
- [socketlib](https://github.com/farling42/foundryvtt-socketlib) **1.1.3** or newer

## Installation

Install using a manifest link:
```
https://github.com/reynevan24/anarchist-overlay/releases/latest/download/module.json
```

## Example usage:

Macro:
```js

const overlayConfig = {
  positionX: 'start',
  positionY: 'center',
  hideUi: true, // hides sidebar/chat/hotbar via CSS; restored when overlay closes
  centerMap: true, // pans so the scene map is centered on screen (all clients)
}

const textConfig = {
  offsetX: '20px',
  offsetY: '0',
  typingTime: 2,
  delay: 1,
  blackBars: true,
  lines: [{
      text: 'MISSION 1: BUG HUNT',
      fontSize: '52px',
    },
    {
      text: 'COMBAT: TRAPDOOR SPIDER',
      fontSize: '38px',
    },
    {
      text: 'OBJECTIVE: SEARCH AND DESTROY',
      fontSize: '34px'
    },
    {
      text: 'EARLY SPRING, 5014U | HERCYNIA',
      fontSize: '20px'
    },
    {
      text: 'FOREST NEAR EVERGREEN | WEATHER: EXTREME HUMIDITY',
      fontSize: '20px'
    },
  ]
}


const anarchistOverlay = game.modules.get('anarchist-overlay');
const textHtml = await anarchistOverlay.createTextCrawlHtml(textConfig);

await anarchistOverlay.createOverlay(overlayConfig, textHtml);

```
Effect:

![Animation](https://user-images.githubusercontent.com/10486394/233835406-5a02eaf6-3374-491b-97ba-813512fab075.gif)

### Glitch Effect:

```js
const overlayConfig = {
    positionX: 'center',
    positionY: 'center',
    closeTime: 18,
    aboveUi: false,
    blockInteractions: false
}

const textConfig = {
    offsetX: '20px',
    offsetY: '0',
    typingTime: 1.5,
    delay: 0.5,
    blackBars: false,
    glitchEffect: { time: 0.5 },
    lines: [
      {
        text: '>//CC: FORCOMM X-X DESG:: “BROADCAST”',
        fontSize: '30px',
      },
      {
        text: '>//if:::HOSTILE=TRUE then:::',
        fontSize: '30px',
      },
      {
        text: '>//WIPE THEM ALL AWAY',
        fontSize: '30px'
      },
      {
        text: '>//EVERY SINGLE ONE OF THEM',
        fontSize: '30px'
      },
      {
        text: '>//KILL THEM WITH PREJUDICE LEAVE NO GROUND UNBURNED',
        fontSize: '30px'
      },
      {
        text: '>//if:::CINDERS ASH DARK SMOKE=TRUE then:::',
        fontSize: '30px'
      },
      {
        text: '>//AWAIT FURTHER TASKING',
        fontSize: '30px'
      },
    ]
  }


const anarchistOverlay = game.modules.get('anarchist-overlay');
const textHtml = await anarchistOverlay.createTextCrawlHtml(textConfig);

await anarchistOverlay.createOverlay(overlayConfig, textHtml);
```
![Animation-4](https://github.com/reynevan24/anarchist-overlay/assets/10486394/7a0c55be-2a1b-4bb2-b987-df6e6fc78b7d)

## Configuration

Both configs are plain JavaScript objects passed to the module API. Only the GM can call `createOverlay`; the overlay is broadcast to every connected client via socketlib.

### `OverlayConfig` — `createOverlay(config, html)`

Controls layout, timing, and Foundry integration for the overlay shell. The second argument is arbitrary HTML (often from `createTextCrawlHtml`).

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `positionX` | `string` | `'center'` | Horizontal placement of overlay content inside the full-screen layer. Uses CSS flexbox `justify-content`. Common values: `'start'`, `'center'`, `'end'`. |
| `positionY` | `string` | `'center'` | Vertical placement of overlay content. Uses CSS flexbox `align-items`. Common values: `'start'`, `'center'`, `'end'`. |
| `closeTime` | `number` | `15` | How long the overlay stays visible, in **seconds**. When the timer ends, the overlay is removed. Set to `0` to keep it open until you remove it manually (e.g. by creating another overlay or reloading). |
| `fadeOnClose` | `boolean` | `true` | If `true`, the overlay fades out over 2 seconds before being removed (after `closeTime` elapses). If `false`, it disappears immediately. |
| `closeAllWindows` | `boolean` | `true` | Closes open **document sheets** (actor/item/scene windows, etc.) on every client before the overlay appears. Does **not** close core Foundry UI (sidebar, chat, hotbar). |
| `hideUi` | `boolean` | `false` | Hides Foundry chrome (sidebar, chat, hotbar, navigation, players, pause, notifications) with CSS on all clients. Restored automatically when the overlay closes. |
| `centerMap` | `boolean` | `false` | Animates the canvas pan so the **center of the scene map** is in the viewport. Runs on every client. Executed after `hideUi` so the viewport size is correct when the UI is hidden. Does not change zoom. |
| `centerMapDuration` | `number` | `500` | Length of the pan animation in **milliseconds** when `centerMap` is `true`. |
| `aboveUi` | `boolean` | `true` | If `true`, raises the overlay above Foundry Application V2 windows (dynamic z-index). If `false`, the overlay sits under the normal UI layer. |
| `blockInteractions` | `boolean` | `true` | If `true`, the overlay captures pointer events so users cannot click the canvas or UI underneath until the overlay closes. If `false`, clicks pass through the overlay (useful for decorative overlays). |

**Notes**

- Creating a new overlay removes any existing `.anarchist-overlay` on all clients first.
- `hideUi` and `centerMap` are independent: you can use either, both, or neither.
- No scene setup is required for `centerMap`; only `centerMap: true` in the macro config.

### `TextCrawlConfig` — `createTextCrawlHtml(config)`

Builds HTML for the Star-Wars-style scrolling/typing text effect. Returns a string you pass as the second argument to `createOverlay`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `lines` | `{ text: string; fontSize?: string }[]` | *(required)* | Lines of text to display, in order. Each line is typed out sequentially. |
| `lines[].text` | `string` | — | The line content. |
| `lines[].fontSize` | `string` | `'32px'` | CSS font size for that line. |
| `offsetX` | `string` | `'0'` | Horizontal offset for the text block (any valid CSS length, e.g. `'20px'`). |
| `offsetY` | `string` | `'0'` | Vertical offset for the text block. |
| `typingTime` | `number` | `2` | Duration of the typing animation for **one line**, in **seconds**. |
| `delay` | `number` | `1` | Pause after a line finishes typing, before the next line starts, in **seconds**. |
| `blackBars` | `boolean` | `true` | Renders cinematic black bars at the top and bottom of the screen. |
| `glitchEffect` | `{ time: number } \| false` | `false` | Adds a looping glitch animation. When enabled, pass an object with `time`: loop duration in **seconds**. Set to `false` to disable. |

### TypeScript types

For reference, the exported types match the tables above:

```ts
type OverlayConfig = {
  positionX?: string;
  positionY?: string;
  fadeOnClose?: boolean;
  closeTime?: number;
  closeAllWindows?: boolean;
  hideUi?: boolean;
  centerMap?: boolean;
  centerMapDuration?: number;
  aboveUi?: boolean;
  blockInteractions?: boolean;
};

type TextCrawlConfig = {
  offsetX?: string;
  offsetY?: string;
  typingTime?: number;
  delay?: number;
  blackBars?: boolean;
  lines: { text: string; fontSize?: string }[];
  glitchEffect?: { time: number } | false;
};
```

## Testing

See [TESTING.md](TESTING.md) for the v13 manual test checklist.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
