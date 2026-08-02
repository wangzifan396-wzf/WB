# InvoiceForge

> 离线发票 / 报价单生成器 · 单文件 · 零依赖 · 数据永不离机

**在线使用：https://wangzifan396-wzf.github.io/WB/tools/InvoiceForge/**

![tests](https://github.com/wangzifan396-wzf/WB/tree/main/tools/InvoiceForge/actions/workflows/test.yml/badge.svg)

## 功能

- **四种单据**：报价单 / 发票 / 收据 / 结算单
- **行项目计税**：数量 × 单价自动小计，支持税率（%）与优惠金额，合计实时计算
- **人民币大写金额**：合计自动转「壹仟贰佰叁拾肆元伍角陆分」，覆盖零元 / 亿级 / 角分边界
- **A4 实时预览**：白底票据版式，所见即所得
- **打印导出 PDF**：`window.print()` + 打印样式，一键出 PDF
- **JSON 备份**：导出 / 导入完整单据，编号自动生成（INV-YYYYMMDD-NNNN）
- **本地存储**：localStorage 自动保存，全程无网络请求

## 为什么

在线发票工具要上传你的客户与金额数据。InvoiceForge 是一个 HTML 文件——
所有计算在你的浏览器里完成，敏感商业数据永不离机。

## 技术

- 原生 JavaScript，零第三方库
- 纯函数数据层（`window.InvoiceForgePure`）：`calcTotals` / `cnUpper` / `renderInvoice` 等可独立测试
- `_test.js` 36 断言 + `smoke.js` 9 项 DOM 冒烟检查

## 本地开发

```bash
node _test.js        # 纯函数单测
node smoke.js        # jsdom 冒烟测试（需 jsdom）
```

## License

MIT

---

nano-tools 矩阵成员 · [全部工具](https://github.com/wangzifan396-wzf/WB)
