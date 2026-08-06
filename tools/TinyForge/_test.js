
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sup digits', A.tinySuper('123')==='¹²³');
ok('sup hi', A.tinySuper('Hi')==='ᴴⁱ');
ok('sub digits', A.tinySub('123')==='₁₂₃');
ok('sub zero', A.tinySub('0')==='₀');
ok('passthrough', A.tinySuper('@#')==='@#');
console.log('TinyForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
