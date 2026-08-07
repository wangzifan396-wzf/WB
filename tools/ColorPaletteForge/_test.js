
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.palettes('#ff0000');
ok('complementary cyan', p.complementary==='#00ffff');
ok('triadic 3', p.triadic.length===3);
ok('analogous 3', p.analogous.length===3);
ok('base returned', p.base==='#ff0000');
ok('split 3', p.splitComplementary.length===3);
console.log('ColorPaletteForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
