
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('genEmail format', /^[\w.]+@example\.com$/.test(A.genEmail("example.com")));
var b=A.batch(15,"test.org"); ok('batch 15', b.length===15); ok('all match domain', b.every(function(x){return /^[\w._]+@test\.org$/.test(x);}));
ok('genLocal nonempty', A.genLocal().length>0);
console.log('FakeEmailForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
