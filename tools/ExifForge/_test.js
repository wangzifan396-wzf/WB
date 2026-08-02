/* Node test: extract first <script> from index.html, run pure fns, assert. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('NO SCRIPT FOUND'); process.exit(1); }
const fn = new Function('module', 'exports', 'require', m[1]);
fn(module, module.exports, require);
const A = module.exports;

let pass = 0, fail = 0;
function ok(name, cond){ if (cond) pass++; else { fail++; console.error('  FAIL: ' + name); } }

function buildTiff(){
  var buf=new ArrayBuffer(26);
  var dv=new DataView(buf), le=true;
  dv.setUint8(0,0x49); dv.setUint8(1,0x49);
  dv.setUint16(2,0x2A,le);
  dv.setUint32(4,8,le);
  dv.setUint16(8,1,le);            // IFD0 entry count = 1
  dv.setUint16(10,0x010F,le);      // tag Make
  dv.setUint16(12,2,le);           // ASCII
  dv.setUint32(14,4,le);           // count = 4 ("Test")
  dv.setUint8(18,0x54); dv.setUint8(19,0x65); dv.setUint8(20,0x73); dv.setUint8(21,0x74);
  dv.setUint32(22,0,le);           // next IFD = 0
  return new Uint8Array(buf);
}
function buildJpeg(){
  var tiff=buildTiff();
  var app1=[0x45,0x78,0x69,0x66,0x00,0x00].concat(Array.from(tiff));
  var len=app1.length+2;
  return Uint8Array.from([0xFF,0xD8, 0xFF,0xE1, (len>>8)&0xff, len&0xff].concat(app1).concat([0xFF,0xD9]));
}

var tiff=buildTiff();
ok('parseTiff Make', A.parseTiff(tiff).Make === 'Test');

var jpeg=buildJpeg();
ok('parseExifFromJpeg Make', (function(){ var t=A.parseExifFromJpeg(jpeg); return t && t.Make==='Test'; })());
ok('parseExifFromJpeg not null', A.parseExifFromJpeg(jpeg) !== null);

var cleaned=A.stripExif(jpeg);
ok('stripExif removes APP1', cleaned.length === 4);
ok('stripExif no Exif marker', !(cleaned[2]===0xFF && cleaned[3]===0xE1));

ok('no exif -> null', A.parseExifFromJpeg(Uint8Array.from([0xFF,0xD8,0xFF,0xD9])) === null);
ok('non jpeg -> null', A.parseExifFromJpeg(Uint8Array.from([0x00,0x01,0x02])) === null);

console.log('ExifForge _test: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
