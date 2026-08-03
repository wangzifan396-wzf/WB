# I18nForge

i18n 键生成器：把英文标签批量转换为 camelCase / PascalCase / snake_case / kebab-case / dot.case / CONSTANT_CASE 风格的 i18n 键，可加命名空间前缀并去重，生成多语言字典键时省去手工命名。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/I18nForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
