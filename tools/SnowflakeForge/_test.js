
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var id = A.snowEncode(1700000000000, 1, 2, 3);
var d = A.snowDecode(id);
ok('ts', d.timestamp === 1700000000000);
ok('dc', d.datacenter === 1);
ok('worker', d.worker === 2);
ok('seq', d.sequence === 3);
ok('custom epoch', A.snowDecode(A.snowEncode(1000,0,0,0,1000), 1000).timestamp === 1000);
ok('numeric', /^[0-9]+$/.test(id));
console.log('SnowflakeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
