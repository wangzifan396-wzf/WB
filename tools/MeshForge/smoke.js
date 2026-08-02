/* MeshForge smoke test - jsdom boot, no-WebGL graceful degradation.
   Run: NODE_PATH=<managed workspace>/node_modules node smoke.js */
"use strict";
var fs = require("fs");
var path = require("path");
var { JSDOM } = require("jsdom");

var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
var errors = [];
var IGNORE = /(not implemented|navigation|requestAnimationFrame|webgl|canvas|getContext|createObjectURL|toDataURL)/i;

var dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "https://localhost/",
  beforeParse: function (window) {
    /* jsdom canvas: getContext returns null for webgl - that IS the
       degradation path we want to exercise. Provide a null-returning stub
       so the call itself never throws. */
    window.HTMLCanvasElement.prototype.getContext = function () { return null; };
    window.HTMLCanvasElement.prototype.toDataURL = function () { return "data:image/png;base64,"; };
    window.requestAnimationFrame = function (f) { return setTimeout(f, 16); };
    window.cancelAnimationFrame = function (id) { clearTimeout(id); };
    window.addEventListener("error", function (e) {
      var msg = (e && e.message) || "unknown error";
      if (!IGNORE.test(msg)) errors.push(msg);
    });
  },
  virtualConsole: (function () {
    var { VirtualConsole } = require("jsdom");
    var vc = new VirtualConsole();
    vc.on("jsdomError", function (e) {
      var msg = (e && e.message) || String(e);
      if (!IGNORE.test(msg)) errors.push(msg);
    });
    return vc;
  })()
});

setTimeout(function () {
  var window = dom.window, document = window.document;
  var fails = [];
  function ok(cond, name) { if (!cond) fails.push(name); }

  ok(errors.length === 0, "no page errors: " + errors.join("; "));
  var H = window.__MESHFORGE__;
  ok(!!H, "__MESHFORGE__ exposed");
  if (H) {
    ok(H.version === "1.0.0", "version");
    ok(H.hasGL === false, "no WebGL in jsdom (degraded mode)");
    ok(typeof H.kernel.mfParseOBJ === "function", "kernel reachable");

    /* DOM structure */
    ok(!!document.getElementById("gl"), "canvas present");
    ok(!!document.getElementById("fileInput"), "file input present");
    ok(document.getElementById("glErr").style.display === "flex", "glErr banner shown without WebGL");

    /* sample loading works without GL (buffers skipped, stats updated) */
    var mesh = H.loadSample("cube");
    ok(H.state.mesh && H.state.mesh.triangleCount === 12, "cube sample loaded");
    ok(document.getElementById("stTris").textContent === "12", "stats tris = 12");
    ok(document.getElementById("dropHint").className.indexOf("hidden") >= 0, "drop hint hidden");

    /* loadData OBJ text path */
    var m2 = H.loadData("tri.obj", "v 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3");
    ok(m2 && m2.triangleCount === 1, "loadData obj");
    ok(document.getElementById("stName").textContent === "tri.obj", "stats file name");

    /* mode switching */
    H.setMode("wireframe");
    ok(H.state.mode === "wireframe", "mode switch");

    /* i18n round trip */
    H.applyLang("en");
    ok(document.querySelector('[data-i18n="secModel"]').textContent === "Model", "i18n en");
    H.applyLang("zh");
    ok(document.querySelector('[data-i18n="secModel"]').textContent === "\u6a21\u578b", "i18n zh");

    /* render() is a safe no-op without GL */
    var threw = false;
    try { H.render(); } catch (e) { threw = true; }
    ok(!threw, "render safe without GL");
  }

  if (fails.length) {
    console.error("SMOKE FAIL:\n  " + fails.join("\n  "));
    process.exit(1);
  }
  console.log("MeshForge smoke: PASS");
  process.exit(0);
}, 250);
