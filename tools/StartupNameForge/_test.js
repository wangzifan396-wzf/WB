
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.batch(20); ok('batch len 20', b.length===20);
ok('no spaces', b.every(function(x){return x.indexOf(" ")<0;}));
ok('only alnum', b.every(function(x){return /^[a-zA-Z]+$/.test(x);}));
ok('gen nonempty', A.gen().length>0);
console.log('StartupNameForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
