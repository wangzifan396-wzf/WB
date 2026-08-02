# MeshForge

**离线 3D 模型查看器 —— 单文件 · 零依赖 · 本地优先**

Offline 3D model viewer in a single HTML file. Drop an OBJ / STL, orbit it in WebGL, export a PNG snapshot. Zero dependencies, nothing ever leaves your device.

**Live**: https://wangzifan396-wzf.github.io/WB/tools/MeshForge/

## 功能 Features

- **OBJ 解析**：`v` / `vn` / `f`，多边形面扇形三角化，负索引，`v/vt/vn` 全格式；缺法线时自动计算平面法线
- **STL 解析**：二进制 / ASCII 自动识别（含"以 `solid` 开头的二进制文件"陷阱处理）；零法线自动重算
- **WebGL 轨道渲染**：拖拽旋转、滚轮缩放、自动旋转；透视投影 + 双光源 Lambert 着色
- **三种显示模式**：着色 / 线框（边缘拆解）/ 点云
- **场景辅助**：RGB 坐标轴、地面网格（随模型半径自适应缩放）、AABB 自动取景
- **PNG 快照导出**、统计面板（顶点/三角形/包围盒）、中英双语、暗色 Linear 风格
- **PWA**：Service Worker 缓存，安装后完全离线可用
- **优雅降级**：无 WebGL 环境下解析内核与统计仍然可用

## 纯函数内核 Pure kernel (`MF`)

| 函数 | 说明 |
| --- | --- |
| `mfParseOBJ(text)` | OBJ → 三角形汤 {positions, normals, counts} |
| `mfParseSTL(buf)` / `mfParseAsciiStl(text)` / `mfIsAsciiStl(u8)` | STL 二进制/ASCII 解析与探测 |
| `mfComputeNormals(pos)` | 平面法线 |
| `mfAabb(pos)` / `mfFitDistance(r,fov)` | 包围盒 / 取景距离 |
| `mfMat4Identity/Multiply/Translate/Scale/RotateX/RotateY` | 列主序 mat4 |
| `mfMat4Perspective/LookAt` / `mfNormalMatrix(m)` | 投影 / 视图 / 法线矩阵（余子式法） |
| `mfOrbitEye(theta,phi,dist,target)` | 轨道相机 |
| `mfEdges(pos)` | 三角形 → 线段汤（线框） |
| `mfTorus(R,r,su,sv)` / `mfCube(s)` | 示例网格 |

内核零 DOM 依赖，可直接 `require("./index.html 的首个 script")` 复用 —— 见 `_test.js`。

## 测试 Tests

```bash
node _test.js   # 88 kernel assertions (parsers, mat4, round-trips)
node smoke.js   # jsdom boot + no-WebGL degradation (needs jsdom via NODE_PATH)
```

## 隐私 Privacy

一切解析与渲染都在你的浏览器本地完成，无网络请求、无遥测、无上传。

## License

MIT
