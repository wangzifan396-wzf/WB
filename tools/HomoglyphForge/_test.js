
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var keys=Object.keys(A.HM);
ok('roundtrip all', keys.every(function(k){ return A.hgDecode(A.hgEncode(k))===k; }));
ok('encode changes', A.hgEncode('abc')!=='abc');
ok('detect', A.hgDetect(A.hgEncode('abc')).length===3);
console.log('HomoglyphForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
