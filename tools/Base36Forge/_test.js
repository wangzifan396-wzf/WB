
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('35', A.toBase36(35)==='z');
ok('36', A.toBase36(36)==='10');
ok('from', A.fromBase36('z')===35);
ok('from10', A.fromBase36('10')===36);
ok('round', A.fromBase36(A.toBase36(12345))===12345);
console.log('Base36Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
