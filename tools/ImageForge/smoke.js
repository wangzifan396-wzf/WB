// ImageForge jsdom smoke test — load index.html, run UI script, assert no crash + key nodes exist.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let jsdomError = 0;
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    // canvas getContext is not implemented in jsdom; stub enough for construction paths
    window.HTMLCanvasElement.prototype.getContext = function () {
      return {
        drawImage() {}, clearRect() {}, fillRect() {}, strokeRect() {},
        translate() {}, rotate() {}, scale() {}, fillText() {}, strokeText() {},
        set filter(v) {}, get filter() { return 'none'; },
        set imageSmoothingQuality(v) {}, set fillStyle(v) {}, set strokeStyle(v) {},
        set font(v) {}, set textAlign(v) {}, set textBaseline(v) {},
        getImageData() { return { data: [] }; }
      };
    };
    window.HTMLCanvasElement.prototype.toBlob = function (cb) { cb(new window.Blob([''], { type: 'image/png' })); };
    window.URL.createObjectURL = function () { return 'blob:mock'; };
    window.URL.revokeObjectURL = function () {};
  }
});

const w = dom.window;
w.addEventListener('error', function () { jsdomError++; });

setTimeout(function () {
  const doc = w.document;
  const pureOk = typeof w.ImageForgePure === 'object' && typeof w.ImageForgePure.computeResize === 'function';
  const hasStage = !!doc.querySelector('#stage');
  const hasDrop = !!doc.querySelector('#drop');
  const hasExport = !!doc.querySelector('#exportBtn');
  const iconFilled = (doc.querySelector('#brandIcon').innerHTML || '').indexOf('<svg') === 0;

  const ok = jsdomError === 0 && pureOk && hasStage && hasDrop && hasExport && iconFilled;
  if (ok) {
    console.log('SMOKE OK  jsdomError=' + jsdomError + '  ImageForgePure=' + typeof w.ImageForgePure + '  stage/drop/export=ok  icon=ok');
    process.exit(0);
  } else {
    console.error('SMOKE FAIL  jsdomError=' + jsdomError + ' pure=' + pureOk + ' stage=' + hasStage + ' drop=' + hasDrop + ' export=' + hasExport + ' icon=' + iconFilled);
    process.exit(1);
  }
}, 200);
