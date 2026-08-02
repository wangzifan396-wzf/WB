const fs=require('fs');
const path=require('path');
const vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('FAIL: no <script> found'); process.exit(1); }
const code=m[1];
const fn=new Function('module','exports','require',code);
fn(module,exports,require);
const e=module.exports;
const assert=require('assert');

assert(typeof e.formatBytes==='function','formatBytes export');
assert(typeof e.buildGlyphSet==='function','buildGlyphSet export');
assert(typeof e.buildSpecimenSVG==='function','buildSpecimenSVG export');

assert.strictEqual(e.formatBytes(0),'0 B');
assert.strictEqual(e.formatBytes(1023),'1023 B');
assert.strictEqual(e.formatBytes(1024),'1.0 KB');
assert.strictEqual(e.formatBytes(1536),'1.5 KB');
assert.strictEqual(e.formatBytes(1048576),'1.0 MB');

const gs=e.buildGlyphSet();
assert(gs.length>60,'glyph set too small: '+gs.length);
assert(gs.includes('A')&&gs.includes('z')&&gs.includes('0')&&gs.includes('!'),'glyph set missing classes');

const svg=e.buildSpecimenSVG({name:'Test',text:'Hello & <world>',glyphs:gs,opts:{size:64,color:'#fff',bg:'#000',align:'center',weight:700},fontB64:null});
assert(svg.startsWith('<svg'),'svg must start with <svg');
assert(svg.includes('Hello &amp; &lt;world&gt;'),'must escape XML');
assert(svg.includes('text-anchor="middle"'),'center align');
assert(svg.includes('font-weight="700"'),'weight applied');
assert(svg.includes('@font-face')===false,'no embedded font when null');

const svg2=e.buildSpecimenSVG({name:'X',text:'A',glyphs:['A'],opts:{},fontB64:'QUJD'});
assert(svg2.includes('data:font/woff2;base64,QUJD'),'must embed base64 font');

console.log('PASS _test.js  ('+gs.length+' glyphs, svg '+svg.length+' chars)');
