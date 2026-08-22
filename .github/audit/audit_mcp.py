# -*- coding: utf-8 -*-
"""WB MCP 化 manifest 门禁 —— 校验全部 tools/*/mcp.json 的结构完整性与一致性。

背景：WB 每个工具 = 一个 MCP tool，元数据落在 tools/<id>/mcp.json（第 8 文件）。
本门禁防 manifest 腐化，检查维度：

  P0 [阻断] JSON 无法解析 / 缺 id·name·entry / name 与蛇形 id 不一致 /
            entry 不在 entries 中 / inputSchema 缺或 type != object / name 全局重复
  P1 [阻断] inputSchema.properties 非 object / domFree 非 bool / core 空
  P2 [报告] entries 各项缺 paramStyle·paramNames / schema 键与 entry 参数不对齐 /
            schemaSource 取值非法

用法:
  python audit_mcp.py [tools_dir]            # 默认 tools
  python audit_mcp.py tools --json out.json
"""
import io, os, re, sys, json


def to_snake(s):
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s)
    s = re.sub(r"([A-Z])([A-Z][a-z])", r"\1_\2", s)
    return s.lower()


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    tools_dir = args[0] if args else os.environ.get("WB_TOOLS_DIR", "tools")
    tools_dir = os.path.abspath(tools_dir)

    findings = {"[P0]": [], "[P1]": [], "[P2]": []}
    scanned = 0
    seen_names = {}

    if not os.path.isdir(tools_dir):
        findings["[P0]"].append("tools 目录不存在: %s" % tools_dir)
        _report(findings, 0)
        sys.exit(1)

    ids = sorted(d for d in os.listdir(tools_dir)
                 if os.path.isdir(os.path.join(tools_dir, d)))
    for tid in ids:
        mp = os.path.join(tools_dir, tid, "mcp.json")
        if not os.path.exists(mp):
            continue  # 无 manifest 的工具不参与 MCP 门禁（如 needs-adapt 跳过者）
        scanned += 1
        raw = io.open(mp, encoding="utf-8", errors="replace").read()
        try:
            m = json.loads(raw)
        except Exception as e:
            findings["[P0]"].append("%s :: mcp.json 无法解析: %s" % (tid, e))
            continue
        if not isinstance(m, dict):
            findings["[P0]"].append("%s :: manifest 不是 JSON object" % tid)
            continue

        # P0: 必填字段
        for f in ("id", "name", "entry"):
            if not m.get(f):
                findings["[P0]"].append("%s :: 缺必填字段 %r" % (tid, f))
        # P0: name 与蛇形 id 一致
        if m.get("id") and m.get("name"):
            if m["id"] != tid:
                findings["[P0]"].append("%s :: manifest.id(%s) 与目录名不一致" % (tid, m["id"]))
            if m["name"] != to_snake(tid):
                findings["[P0]"].append("%s :: name(%s) != 蛇形 id(%s)" % (tid, m["name"], to_snake(tid)))
            if m["name"] in seen_names:
                findings["[P0]"].append("%s :: name %r 与 %s 重复" % (tid, m["name"], seen_names[m["name"]]))
            seen_names[m["name"]] = tid

        # P0: entry 必须在 entries 中
        entries = m.get("entries") or {}
        if m.get("entry") and isinstance(entries, dict):
            if m["entry"] not in entries:
                findings["[P0]"].append("%s :: entry(%s) 不在 entries 键中" % (tid, m["entry"]))

        # P0: inputSchema 存在且 type=object
        schema = m.get("inputSchema")
        if not schema or not isinstance(schema, dict):
            findings["[P0]"].append("%s :: 缺 inputSchema 或非 object" % tid)
        elif schema.get("type") != "object":
            findings["[P0]"].append("%s :: inputSchema.type=%r（应 object）" % (tid, schema.get("type")))

        # P1: properties 是 dict
        if isinstance(schema, dict) and not isinstance(schema.get("properties", {}), dict):
            findings["[P1]"].append("%s :: inputSchema.properties 非 object" % tid)

        # P1: domFree 是 bool
        if "domFree" in m and not isinstance(m.get("domFree"), bool):
            findings["[P1]"].append("%s :: domFree 非 bool（%r）" % (tid, m.get("domFree")))

        # P1: core 非空
        if not isinstance(m.get("core"), str) or not m["core"].strip():
            findings["[P1]"].append("%s :: core 为空或非字符串" % tid)

        # P2: entries 各项 paramStyle/paramNames
        if isinstance(entries, dict):
            for k, v in entries.items():
                if not isinstance(v, dict):
                    findings["[P2]"].append("%s :: entries.%s 非 object" % (tid, k))
                    continue
                if v.get("paramStyle") not in ("object", "positional", "single", "none"):
                    findings["[P2]"].append("%s :: entries.%s.paramStyle=%r 非法" % (tid, k, v.get("paramStyle")))
                if not isinstance(v.get("paramNames"), list):
                    findings["[P2]"].append("%s :: entries.%s 缺 paramNames 数组" % (tid, k))

        # P2: schema 键与 entry 参数对齐（仅对 entry 做，auto 推导天然一致）
        if isinstance(schema, dict) and isinstance(entries, dict) and m.get("entry") in entries:
            ev = entries[m["entry"]]
            if isinstance(ev, dict) and isinstance(schema.get("properties", {}), dict):
                prop_keys = set(schema["properties"].keys())
                style = ev.get("paramStyle")
                if style in ("positional", "single"):
                    want = set(ev.get("paramNames") or [])
                    if prop_keys != want:
                        findings["[P2]"].append(
                            "%s :: schema.properties 键(%s) != entry 参数(%s)"
                            % (tid, sorted(prop_keys), sorted(want)))
                elif style == "none":
                    if prop_keys:
                        findings["[P2]"].append(
                            "%s :: 无参 entry 却有 %d 个 schema 属性" % (tid, len(prop_keys)))

        # P2: schemaSource 取值
        if "schemaSource" in m and m.get("schemaSource") not in ("auto", "curated"):
            findings["[P2]"].append("%s :: schemaSource=%r 非法" % (tid, m.get("schemaSource")))

    _report(findings, scanned)


def _report(findings, scanned):
    print("=" * 72)
    print("WB MCP manifest 门禁 —— 扫描 %d 个 mcp.json" % scanned)
    print("=" * 72)
    if not any(findings.values()):
        print("无缺陷。")
    for k in ("[P0]", "[P1]", "[P2]"):
        v = findings[k]
        if v:
            print("\n%s  命中 %d" % (k, len(v)))
            for item in v[:40]:
                print("   - " + item)
            if len(v) > 40:
                print("   ... 另有 %d 条" % (len(v) - 40))
    print("\n" + "-" * 72)
    print("合计问题类别: %d | 问题条目: %d"
          % (sum(1 for v in findings.values() if v), sum(len(v) for v in findings.values())))

    if "--json" in sys.argv:
        out = sys.argv[sys.argv.index("--json") + 1]
        io.open(out, "w", encoding="utf-8").write(
            json.dumps({"scanned": scanned, "findings": findings}, ensure_ascii=False, indent=1))
        print("明细已写出: " + out)

    blocking = len(findings["[P0]"]) + len(findings["[P1]"])
    if blocking:
        print("发布阻断项(P0/P1): %d —— 必须先修复" % blocking)
    sys.exit(1 if blocking else 0)


if __name__ == "__main__":
    main()
