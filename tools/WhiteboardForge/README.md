# WhiteboardForge

Offline infinite-canvas whiteboard. A single HTML file, zero dependency, fully local — your sketches never leave the browser.

## Features
- **Tools**: select, rectangle, ellipse, line, arrow, freehand pen, text, sticky note, eraser.
- **Infinite canvas**: pan by dragging empty space, zoom with the mouse wheel.
- **Style**: stroke / fill color pickers + swatches, adjustable line width.
- **Editing**: move and select; `Delete` removes the selection; `Ctrl/Cmd+Z` undo, `Shift+` redo.
- **Autosave**: the scene is persisted to `localStorage` and restored on open.
- **Export**: PNG (rasterized from scene bounds) and SVG (vector).
- **Bilingual UI** (中文 / English).
- Fully keyboard- and offline-friendly (installable PWA).

## Kernel
The `WF` object (top-level, pure functions) powers everything and is unit-tested:
- `WF.create(type, props)` — shape factory (rect / ellipse / line / arrow / free / text / note).
- `WF.bounds(shapes)` — scene bounding box.
- `WF.hitTest(shapes, x, y, tol)` — topmost shape under a world point.
- `WF.serialize` / `WF.deserialize` — JSON round-trip.
- `WF.fit(shapes, vw, vh, pad)` — compute pan/zoom to fit.
- `WF.toSVG(shapes)` — vector export.

## Tests
```
node _test.js   # kernel assertions
node smoke.js   # jsdom render smoke test (canvas-safe)
```

## Privacy
No network requests, no analytics, no uploads. Works offline.

## License
MIT
