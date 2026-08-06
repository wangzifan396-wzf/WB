
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('single', A.quant([[255,0,0]], 1)[0] === "#f00000");
ok('len', A.quant([[255,0,0],[255,0,0],[0,255,0],[0,0,255]], 3).length === 3);
ok('top', A.quant([[255,0,0],[255,0,0],[0,255,0],[0,0,255]], 3).indexOf("#f00000") >= 0);
ok('hex fmt', /^#[0-9a-f]{6}$/.test(A.quant([[10,20,30]], 1)[0]));
ok('mid', A.quant([[127,127,127]], 1)[0] === "#707070");
console.log('ImagePaletteForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
