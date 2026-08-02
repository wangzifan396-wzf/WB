# RegexForge

Offline regex tester and visualizer. Single HTML file, zero dependency, fully local — your patterns and test text never leave the browser.

## Features
- **Live match highlighting** of your test text as you type.
- **Capture groups** and **named groups** extracted per match.
- **Railroad diagram** generated from the parsed AST — visualize groups, alternation, and quantifiers at a glance.
- **Cheat sheet** — click any token to insert it into the pattern.
- **Sample patterns** — email, URL, IPv4, hex color, ISO date, named groups, CN phone, slug.
- **Bilingual UI** (中文 / English).
- **Export** matches as JSON.

## Kernel
The `RF` object (top-level, pure functions) powers everything and is unit-tested:
- `RF.parse(pattern)` — recursive-descent parser → AST (seq / alt / group / quant / charclass / escape / anchor / dot / backref).
- `RF.run(pattern, flags, text)` — executes via native `RegExp`, returns matches with index, value, groups, and named groups. Invalid patterns return `{error}` instead of throwing.
- `RF.highlight(text, matches)` / `RF.renderHL(...)` — segment text for rendering.
- `RF.samples`, `RF.cheat` — seed data for the UI.

## Tests
```
node _test.js   # 40+ kernel assertions
node smoke.js   # jsdom render smoke test
```

## Privacy
No network requests, no analytics, no uploads. Works offline (installable PWA).

## License
MIT
