# -*- coding: utf-8 -*-
"""Full-matrix audit v3 —— 覆盖 v2 没检查过的「运行时真实缺陷」维度。

v2 查的是静态卫生（外链 / ES module / localStorage 守卫 / 必需文件 / head 元信息）。
v3 查的是会在浏览器里真的出错或行为不符预期的问题：

  S1 [P0] service worker 在 activate 阶段全局淘汰缓存
          -> 同域 340 仓共享 CacheStorage，会互删离线缓存
  S2 [P1] service worker CACHE 名重复 -> 无法单独失效版本
  D1 [P1] getElementById('x') 但 HTML 里没有 id="x" -> 运行时 null 解引用
  D2 [P1] HTML 内重复 DOM id -> querySelector 命中错元素
  D3 [P2] <label for="x"> 没有对应控件 id -> 点击标签无响应（可访问性）
  C1 [P1] CSS 引用了未定义的自定义属性 var(--foo) -> 颜色回退成空 / 文字消失
  H1 [P1] 缺 <meta charset> -> 中文乱码
  H2 [P2] <a target="_blank"> 缺 rel="noopener" -> 反向 tabnabbing

用法:
  python audit_matrix_v3.py            # 只报告
  python audit_matrix_v3.py --json out.json
"""
import io, os, re, sys, json, collections

ROOT = sys.argv[1] if (len(sys.argv) > 1 and not sys.argv[1].startswith("--")) else "D:/WB_Files"
SKIP = {"wangzifan396-wzf", "promo-assets", "__skills_tmp", "profile", "skills"}
PORTALS = ["WB", "nano-workbench"]


def read(p):
    try:
        return io.open(p, encoding="utf-8", errors="replace").read()
    except Exception:
        return ""


def repos():
    out = []
    for d in sorted(os.listdir(ROOT)):
        p = os.path.join(ROOT, d)
        if not os.path.isdir(p) or d.startswith(".") or d in SKIP:
            continue
        if os.path.exists(os.path.join(p, "index.html")):
            out.append(d)
    return out


# ---------- 单项检查 ----------

RE_GEBI = re.compile(r"""getElementById\(\s*(['"])([A-Za-z0-9_\-]+)\1\s*\)""")
# 只在真正的 HTML 标签内取 id 属性；否则 JS 里的 `el.id = 'x'` 会被误判成重复 id
RE_TAG = re.compile(r"<[a-zA-Z][^<>]*>")
RE_ID_IN_TAG = re.compile(r"""(?:^|\s)id\s*=\s*(['"])([A-Za-z0-9_\-]+)\1""")


def html_ids(html):
    out = []
    for tag in RE_TAG.finditer(html):
        m = RE_ID_IN_TAG.search(tag.group(0))
        if m:
            out.append(m.group(2))
    return out


RE_ID_ATTR = re.compile(r"""\bid\s*=\s*(['"])([A-Za-z0-9_\-]+)\1""")
RE_LABEL_FOR = re.compile(r"""<label[^>]*\bfor\s*=\s*(['"])([A-Za-z0-9_\-]+)\1""", re.I)
RE_VAR_USE = re.compile(r"var\(\s*(--[A-Za-z0-9_\-]+)")
RE_VAR_DEF = re.compile(r"(--[A-Za-z0-9_\-]+)\s*:")
RE_TARGET_BLANK = re.compile(r"<a\b[^>]*target\s*=\s*['\"]_blank['\"][^>]*>", re.I)
RE_CHARSET = re.compile(r"<meta[^>]+charset", re.I)
RE_STYLE_BLOCK = re.compile(r"<style[^>]*>(.*?)</style>", re.I | re.S)


def check_sw(d):
    """S1 / S2"""
    sw = os.path.join(ROOT, d, "sw.js")
    if not os.path.exists(sw):
        return {"missing": True}
    s = read(sw)
    m = re.search(r"CACHE\s*=\s*(?:'([^']*)'|SCOPE\s*\+\s*'([^']*)')", s)
    if m:
        name = ("nano:%s%s" % (d.lower(), m.group(2))) if m.group(2) else m.group(1)
    else:
        name = "(unparsed)"
    # 全局淘汰特征：activate 里对 caches.keys() 的结果无条件 delete 非自身 key
    act = re.search(r"addEventListener\(\s*'activate'(.*?)\n\}\);", s, re.S)
    body = act.group(1) if act else ""
    global_evict = bool(re.search(r"k\s*!==\s*CACHE", body)) or bool(
        re.search(r"k\s*===\s*CACHE\s*\?\s*null\s*:\s*caches\.delete", body))
    scoped = "indexOf(SCOPE" in body
    return {"cache": name, "global_evict": global_evict and not scoped, "missing": False}


def check_dom(html):
    """D1 / D2 / D3"""
    ids = html_ids(html)
    # getElementById 的解析对象放宽到全文（模板字符串里写的 id 也算存在）
    idset = set(ids) | {m.group(2) for m in RE_ID_ATTR.finditer(html)}
    dup = sorted([k for k, v in collections.Counter(ids).items() if v > 1])
    # 动态生成的 id（模板字符串 / 拼接）无法静态判定，出现即放宽 D1
    dynamic = ("id=\"'+" in html or "id='\"+" in html or 'id="${' in html
               or "id='${" in html or ".id =" in html or ".id=" in html
               or "setAttribute('id'" in html or 'setAttribute("id"' in html)
    missing = sorted({m.group(2) for m in RE_GEBI.finditer(html)} - idset)
    labels = sorted({m.group(2) for m in RE_LABEL_FOR.finditer(html)} - idset)
    return {"dup_ids": dup, "missing_ids": [] if dynamic else missing,
            "dyn": dynamic, "orphan_labels": labels}


def check_css(html):
    """C1 —— 只在 <style> 块内统计，避免把 JS 字符串里的 var() 误判"""
    css = "\n".join(RE_STYLE_BLOCK.findall(html))
    if not css:
        return {"undef_vars": []}
    defined = set(RE_VAR_DEF.findall(css)) | set(RE_VAR_DEF.findall(html))
    used = set(RE_VAR_USE.findall(css))
    # var(--x, fallback) 有兜底，不算缺陷
    with_fallback = set(re.findall(r"var\(\s*(--[A-Za-z0-9_\-]+)\s*,", css))
    return {"undef_vars": sorted(used - defined - with_fallback)}


def check_head(html):
    """H1 / H2"""
    no_charset = not RE_CHARSET.search(html)
    unsafe_blank = [t for t in RE_TARGET_BLANK.findall(html) if "noopener" not in t.lower()]
    return {"no_charset": no_charset, "unsafe_blank": len(unsafe_blank)}


def main():
    rs = repos() + [p for p in PORTALS if p not in repos()
                     and os.path.exists(os.path.join(ROOT, p, "index.html"))]
    findings = collections.defaultdict(list)
    cache_names = collections.Counter()
    per_repo = {}

    for d in rs:
        html = read(os.path.join(ROOT, d, "index.html"))
        sw = check_sw(d)
        dom = check_dom(html)
        css = check_css(html)
        head = check_head(html)
        per_repo[d] = {"sw": sw, "dom": dom, "css": css, "head": head}

        if sw.get("missing"):
            findings["S0 缺 sw.js"].append(d)
        else:
            cache_names[sw["cache"]] += 1
            if sw["global_evict"]:
                findings["S1 [P0] SW 全局淘汰缓存"].append(d)
        if dom["dup_ids"]:
            findings["D2 [P1] 重复 DOM id"].append("%s: %s" % (d, ",".join(dom["dup_ids"][:4])))
        if dom["missing_ids"]:
            findings["D1 [P1] getElementById 目标不存在"].append(
                "%s: %s" % (d, ",".join(dom["missing_ids"][:4])))
        if dom["orphan_labels"]:
            findings["D3 [P2] label for 无对应控件"].append(
                "%s: %s" % (d, ",".join(dom["orphan_labels"][:4])))
        if css["undef_vars"]:
            findings["C1 [P1] CSS 变量未定义"].append(
                "%s: %s" % (d, ",".join(css["undef_vars"][:4])))
        if head["no_charset"]:
            findings["H1 [P1] 缺 meta charset"].append(d)
        if head["unsafe_blank"]:
            findings["H2 [P2] target=_blank 缺 noopener"].append(
                "%s x%d" % (d, head["unsafe_blank"]))

    for k, v in cache_names.items():
        if v > 1:
            findings["S2 [P1] SW CACHE 名重复"].append("%s x%d" % (k, v))

    print("=" * 72)
    print("nano-tools 全矩阵审计 v3  —— 扫描 %d 个仓库" % len(rs))
    print("=" * 72)
    if not findings:
        print("无缺陷。")
    for k in sorted(findings):
        v = findings[k]
        print("\n[%s]  命中 %d" % (k, len(v)))
        for item in v[:25]:
            print("   - " + item)
        if len(v) > 25:
            print("   ... 另有 %d 条" % (len(v) - 25))
    print("\n" + "-" * 72)
    print("合计问题类别: %d | 问题条目: %d" % (len(findings), sum(len(v) for v in findings.values())))

    if "--json" in sys.argv:
        out = sys.argv[sys.argv.index("--json") + 1]
        io.open(out, "w", encoding="utf-8").write(
            json.dumps({"findings": findings, "per_repo": per_repo}, ensure_ascii=False, indent=1))
        print("明细已写出: " + out)

    # P0/P1 视为发布阻断项，非零退出便于接进发布前检查
    blocking = sum(len(v) for k, v in findings.items() if "[P0]" in k or "[P1]" in k)
    if blocking:
        print("发布阻断项(P0/P1): %d —— 必须先修复" % blocking)
    sys.exit(1 if blocking else 0)


if __name__ == "__main__":
    main()
