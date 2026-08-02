# WasmForge

WebAssembly 工具：解析 .wasm 二进制模块，列出自定义段、类型/函数/导入/导出/代码段与数据段，反汇编导出函数为可读的 WAT 片段，并校验魔数（\0asm）与版本。调试 Wasm 模块、理解二进制结构，纯 JS 实现、零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/WasmForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
