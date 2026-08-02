# DockerForge

离线 Docker Run 转 Compose 转换器 · 单文件 · 零依赖 · 本地优先。

## 功能
- `docker run` 命令一键转换为 `docker-compose.yml`
- 支持 `-p/-v/-e/--name/--restart/--network/--user/--workdir/--entrypoint/--label/--add-host/--dns/--cap-add/--device/--memory/--cpus` 等 30+ 参数
- 特殊字符自动 YAML 引号转义；未识别参数以注释警告
- 外部网络自动生成 `networks: external: true` 段

纯函数：`tokenize` / `parseDockerRun` / `toCompose` —— 见 `_test.js`。
