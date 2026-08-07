
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('addBorder(100,100,10)=120,120', (function(){var r=A.addBorder(100,100,10); return r.w===120 && r.h===120;})());
ok('addBorder(200,100,5)=210,110', (function(){var r=A.addBorder(200,100,5); return r.w===210 && r.h===110;})());
ok('addBorderUneven', (function(){var r=A.addBorderUneven(100,100,2,4,6,8); return r.w===106 && r.h===114;})());
console.log('BorderForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
