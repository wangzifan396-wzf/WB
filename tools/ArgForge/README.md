# ArgForge

命令行参数解析器 —— 单文件、零依赖、本地优先。将 argv 解析为 options / flags / 位置参数，支持 `--key=value`、`--key value`、`-abc` 短旗、`--no-flag` 取反。

- `parseArgs(argv, {skipFirst})`：默认保留 argv[0]，设 `skipFirst:true` 跳过程序名。
- 返回值 `{options, flags, positionals}`：flags 为布尔；`--no-x` 置 `flags.x=false`。
- 相邻 `--flag` 后无值则记为布尔 true；值即使以 `-` 开头（如路径）也会被正确取用。

## 测试
```
node _test.js
node smoke.js
```
