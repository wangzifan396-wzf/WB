const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
// protobuf reference vectors
ok('enc 0', J(A.viEncode(0).value)===J([0]));
ok('enc 1', J(A.viEncode(1).value)===J([1]));
ok('enc 127', J(A.viEncode(127).value)===J([0x7f]));
ok('enc 128', J(A.viEncode(128).value)===J([0x80,1]));
ok('enc 300', J(A.viEncode(300).value)===J([0xac,2]));
ok('enc 16384', J(A.viEncode(16384).value)===J([0x80,0x80,1]));
ok('enc large', A.viDecodeOne(A.viEncode(9007199254740991).value,0).value===9007199254740991);
ok('enc negative error', A.viEncode(-1).error!==null);
ok('enc float error', A.viEncode(1.5).error!==null);
// zigzag
ok('zz 0', A.viZigzagEncode(0)===0);
ok('zz -1', A.viZigzagEncode(-1)===1);
ok('zz 1', A.viZigzagEncode(1)===2);
ok('zz -2', A.viZigzagEncode(-2)===3);
ok('zz max', A.viZigzagEncode(2147483647)===4294967294);
ok('zz min', A.viZigzagEncode(-2147483648)===4294967295);
ok('zz roundtrip', A.viZigzagDecode(A.viZigzagEncode(-123456))===-123456);
// decode
ok('dec one', A.viDecodeOne([0xac,2],0).value===300 && A.viDecodeOne([0xac,2],0).length===2);
ok('dec stream', J(A.viDecodeStream([0x00,0xac,0x02,0x7f]).value)===J([0,300,127]));
ok('dec truncated', A.viDecodeStream([0x80]).error!==null);
// hex helpers
ok('hex to bytes', J(A.viHexToBytes('ac 02').value)===J([0xac,2]));
ok('hex odd error', A.viHexToBytes('abc').error!==null);
ok('bytes to hex', A.viBytesToHex([0xac,2])==='ac 02');
console.log('VarintForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
