
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var e=A.bech32Encode('A',[0,1,2]);
ok('lowercase hrp', e.slice(0,2)==='a1');
var d=A.bech32Decode(e);
ok('roundtrip hrp', d && d.hrp==='a');
ok('roundtrip data', d && d.data.join(',')==='0,1,2');
ok('case-insensitive hrp', A.bech32Encode('BC',[1,2])===A.bech32Encode('bc',[1,2]));
ok('bad checksum null', A.bech32Decode('bc1qpzry9r7lxu3')===null);
console.log('Bech32Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
