# SigForge

HTML 邮件签名生成器。填写姓名、职位、公司与联系方式，生成 table 布局、内联样式的兼容签名——Outlook / Gmail / Apple Mail 均可直接粘贴使用。

## 特性
- `sgBuild(data)` 纯函数生成完整签名 HTML（table + 内联样式，最大兼容）
- `sgEsc` XSS 转义、`sgColor` 主色校验回退、`sgInitials` 头像首字母
- 实时预览 + 一键复制源码；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
