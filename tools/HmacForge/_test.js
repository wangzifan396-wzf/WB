const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('sha256 empty', A.sha256([])==='e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
ok('sha256 abc', A.sha256(A.utf8Bytes('abc'))==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
var k1=[]; for(var i=0;i<20;i++) k1.push(0x0b);
ok('rfc4231 tc1', A.hmacSha256(k1, A.utf8Bytes('Hi There'))==='b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
ok('rfc4231 tc2', A.hmacSha256Text('Jefe','what do ya want for nothing?')==='5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843');
var k3=[]; for(var i=0;i<20;i++) k3.push(0xaa);
var d3=[]; for(var i=0;i<50;i++) d3.push(0xdd);
ok('rfc4231 tc3', A.hmacSha256(k3,d3)==='773ea91e36800e46854db8ebd09181a72959098b3ef8c122d9635514ced565fe');
var k6=[]; for(var i=0;i<131;i++) k6.push(0xaa);
ok('rfc4231 tc6 long key', A.hmacSha256(k6, A.utf8Bytes('Test Using Larger Than Block-Size Key - Hash Key First'))==='60e431591ee0b67f0d8a26aacbf5b77f8e0bc6213728c5140546040f0ee37f54');
ok('hexToBytes', JSON.stringify(A.hexToBytes('0aff'))==='[10,255]');
var t=false; try{ A.hexToBytes('abc'); }catch(e){ t=(e.message==='HEX_ODD_LENGTH'); }
ok('hex odd throws', t);
var t2=false; try{ A.hexToBytes('zz'); }catch(e){ t2=(e.message==='HEX_INVALID'); }
ok('hex invalid throws', t2);
ok('timing eq true', A.timingSafeEqual('abcd','abcd'));
ok('timing eq false', !A.timingSafeEqual('abcd','abce'));
ok('timing eq len', !A.timingSafeEqual('ab','abc'));
console.log('HmacForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
