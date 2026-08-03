
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('xor basic', A.xorBytes([65],[1]).join(',')==='64');
var d=[72,101,108,108,111]; var k=[83,69,67];
var c=A.xorBytes(d,k); var back=A.xorBytes(c,k);
ok('xor rt', back.join(',')===d.join(','));
ok('xor empty key throws', (function(){try{A.xorBytes([1],[]);return false;}catch(e){return true;}})());
ok('xor hex', A.bytesToHex(A.xorBytes(A.hexToBytes('ff'),A.hexToBytes('0f')))==='f0');
ok('xor len', A.xorBytes(d,k).length===d.length);
console.log('XorForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
