const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('encode hello', A.b64Encode('hello')==='aGVsbG8=');
ok('encode f', A.b64Encode('f')==='Zg==');
ok('encode fo', A.b64Encode('fo')==='Zm8=');
ok('encode foo', A.b64Encode('foo')==='Zm9v');
ok('encode empty', A.b64Encode('')==='');
ok('decode hello', A.b64Decode('aGVsbG8=').value==='hello');
ok('decode no pad', A.b64Decode('aGVsbG8').value==='hello');
ok('roundtrip utf8', A.b64Decode(A.b64Encode('你好, world!')).value==='你好, world!');
ok('urlsafe no plus', A.b64Encode('\u00ff\u00fe~~', {urlSafe:true}).indexOf('+')===-1);
var urlEnc=A.b64EncodeBytes([251,255],{urlSafe:true,pad:false});
ok('urlsafe -_', urlEnc==='-_8');
ok('no pad option', A.b64Encode('f',{pad:false})==='Zg');
ok('bad char error', A.b64Decode('a$b!').error!==null);
ok('bad length error', A.b64Decode('aaaaa').error!==null);
ok('bytes roundtrip', JSON.stringify(A.b64DecodeToBytes(A.b64EncodeBytes([0,127,128,255])).value)==='[0,127,128,255]');
ok('rfc4648 vector', A.b64EncodeBytes([102,111,111,98,97,114])==='Zm9vYmFy');
console.log('Base64Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
