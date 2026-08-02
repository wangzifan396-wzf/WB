const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('utf8 A', JSON.stringify(A.utf8Bytes('A'))===JSON.stringify([65]));
ok('utf8 e acute', A.utf8Bytes('é').length===2);
ok('utf8 euro len', A.utf8Bytes('€').length===3);
ok('hexToBytes', JSON.stringify(A.hexToBytes('48656c6c6f'))===JSON.stringify([72,101,108,108,111]));
ok('hexToBytes 0x', JSON.stringify(A.hexToBytes('0x48656c6c6f'))===JSON.stringify([72,101,108,108,111]));
ok('hexToBytes odd', JSON.stringify(A.hexToBytes('4ff'))===JSON.stringify([79,15]));
ok('hexToBytes spaces', JSON.stringify(A.hexToBytes('48 65 6c'))===JSON.stringify([72,101,108]));
var dump=A.hexdump(A.utf8Bytes('Hello'));
ok('dump has offset', dump.indexOf('00000000')===0);
ok('dump has Hello', dump.indexOf('Hello')>0);
ok('dump has hex', dump.indexOf('48 65 6c 6c 6f')>0);
ok('inputToBytes text', JSON.stringify(A.inputToBytes('A','text'))===JSON.stringify([65]));
ok('inputToBytes hex', JSON.stringify(A.inputToBytes('41','hex'))===JSON.stringify([65]));
ok('roundtrip', A.hexdump(A.hexToBytes('deadBEEF')).indexOf('de ad be ef')>0);
console.log('HexForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
