
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var enc=A.encode('Hi','public');
ok('roundtrip', A.decode(enc)==='Hi');
ok('carrier preserved', A.decode(enc).length===2 && enc.indexOf('public')>=0);
ok('empty msg', A.decode(A.encode('','x'))==='');
ok('long msg', A.decode(A.encode('Hello, 世界!',''))==='Hello, 世界!');
console.log('SteganographyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
