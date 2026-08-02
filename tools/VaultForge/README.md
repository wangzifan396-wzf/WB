# VaultForge

> Local-first, zero-knowledge encrypted secret vault. AES-GCM + PBKDF2 via the native Web Crypto API. Nothing leaves your device.

**VaultForge** is part of the *nano-tools* matrix — a collection of offline-first, single-file, zero-dependency developer tools. It fills the **security / privacy** gap in the matrix.

---

## 中文

本地优先的零知识加密密码库。所有数据都保存在浏览器中，**绝不会**发送到任何服务器。加密使用原生 Web Crypto API（不依赖任何第三方库）。

### 特性
- **主密码 + 密钥派生**：使用 PBKDF2（SHA-256，20 万次迭代）从主密码派生密钥，用于 AES-GCM 加解密。主密码本身永不被存储。
- **保险库格式**：加密后的密文（base64）保存在 `localStorage` 的 `vaultforge.v1` 键下，结构为 `{ v, salt, iv, ct, iter }`。
- **条目分类**：登录 / 安全笔记 / 银行卡 / 身份，支持增删改、收藏、搜索（标题+字段）、按分类筛选、一键复制字段到剪贴板。
- **密码生成器**：长度滑块，大写/小写/数字/符号/排除易混淆字符开关，实时强度评估。
- **强度计**：基于长度、字符集多样性与简单模式（重复/序列）惩罚给出 Weak / Medium / Strong / VeryStrong 标签与彩色进度条。
- **加密导入/导出**：导出的 `.json` 即为密文，可在其他设备用主密码导入。
- **自动锁定**：空闲 5 分钟或页面隐藏后自动锁定，清空内存中的解密状态。
- **零外部请求**：单文件 `index.html`，系统字体，无任何 `<script src>` / `<link>` 外链，无运行时 `fetch` 到第三方。用户输入一律用 `textContent` 渲染以防 XSS。

### 运行
直接用浏览器打开 `index.html` 即可。也可通过任意静态服务器托管。

> ⚠️ **安全上下文要求**：Web Crypto 仅在安全上下文（HTTPS 或 `localhost`/`file://` 视浏览器而定）可用。在 GitHub Pages（`https://*.github.io`）上可正常工作；直接用 `file://` 打开时部分浏览器会禁用 `crypto.subtle`，此时会提示功能受限。建议通过本地静态服务器或 HTTPS 托管使用。

---

## English

A local-first, zero-knowledge encrypted vault. All data stays in the browser and is **never** sent to any server. Encryption uses the native Web Crypto API (no third-party libraries).

### Features
- **Master password + key derivation**: PBKDF2 (SHA-256, 200k iterations) derives a key from your master password for AES-GCM. The password itself is never stored.
- **Vault format**: the encrypted ciphertext (base64) is stored in `localStorage` under `vaultforge.v1` as `{ v, salt, iv, ct, iter }`.
- **Entry categories**: Login / Secure Note / Card / Identity — add, edit, delete, favorite, search (title+fields), filter by category, copy any field to clipboard.
- **Password generator**: length slider, upper/lower/digit/symbol/exclude-ambiguous toggles, live strength estimate.
- **Strength meter**: labels Weak / Medium / Strong / VeryStrong with a colored bar, based on length, charset variety, and penalties for repeats/sequences.
- **Encrypted export/import**: export the ciphertext as `.json`, importable on another device with the master password.
- **Auto-lock**: locks after 5 min idle (or when the tab is hidden), clearing in-memory decrypted state.
- **Zero external requests**: single-file `index.html`, system font stack, no `<script src>` / external `<link>`, no runtime third-party `fetch`. All user data is rendered via `textContent` to prevent XSS.

### Run
Open `index.html` in a browser, or serve it from any static server.

> ⚠️ **Secure context required**: Web Crypto is only available in secure contexts (HTTPS or `localhost`). It works on GitHub Pages (`https://*.github.io`). Opening via `file://` may disable `crypto.subtle` in some browsers — a notice will appear. Prefer a local static server or HTTPS hosting.

---

## Build

```bash
python3 build.py   # identity copy: template.html -> index.html
node _test.js      # pure-function unit tests
node smoke.js      # jsdom boot smoke test
```

`template.html` is the real source; `build.py` copies it to `index.html` unchanged (single-file / offline-first guarantee).

## License

MIT — part of the nano-tools matrix (GitHub org `wangzifan396-wzf`).
