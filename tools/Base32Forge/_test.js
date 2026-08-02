const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// RFC 4648 test vectors
ok('rfc empty', A.b32EncodeStr('','rfc4648').value==='');
ok('rfc f', A.b32EncodeStr('f','rfc4648').value==='MY======');
ok('rfc fo', A.b32EncodeStr('fo','rfc4648').value==='MZXQ====');
ok('rfc foo', A.b32EncodeStr('foo','rfc4648').value==='MZXW6===');
ok('rfc foob', A.b32EncodeStr('foob','rfc4648').value==='MZXW6YQ=');
ok('rfc fooba', A.b32EncodeStr('fooba','rfc4648').value==='MZXW6YTB');
ok('rfc foobar', A.b32EncodeStr('foobar','rfc4648').value==='MZXW6YTBOI======');
ok('rfc decode', A.b32DecodeStr('MZXW6YTBOI======','rfc4648').value==='foobar');
ok('rfc decode lowercase', A.b32DecodeStr('mzxw6ytboi','rfc4648').value==='foobar');
// base32hex (RFC 4648 section 7)
ok('hex foobar', A.b32EncodeStr('foobar','base32hex').value==='CPNMUOJ1E8======');
ok('hex decode', A.b32DecodeStr('CPNMUOJ1E8======','base32hex').value==='foobar');
// Crockford
ok('crockford foobar', A.b32EncodeStr('foobar','crockford').value==='CSQPYRK1E8');
ok('crockford confusables', A.b32DecodeStr('csqpyrk1e8','crockford').value==='foobar');
ok('crockford IL->1 O->0', A.b32Normalize('iLo','crockford')==='110');
ok('crockford hyphens ignored', A.b32DecodeStr('CSQP-YRK1-E8','crockford').value==='foobar');
// z-base-32
ok('zbase32 roundtrip', A.b32DecodeStr(A.b32EncodeStr('hello \u4e16\u754c','zbase32').value,'zbase32').value==='hello \u4e16\u754c');
ok('zbase32 no pad', A.b32EncodeStr('f','zbase32').value.indexOf('=')===-1);
// errors + utf8
ok('illegal char error', A.b32DecodeStr('@@@@','rfc4648').error!==null);
ok('unknown variant', A.b32EncodeStr('x','nope').error!==null);
ok('utf8 roundtrip rfc', A.b32DecodeStr(A.b32EncodeStr('\u4e2d\u6587\ud83d\ude00','rfc4648').value,'rfc4648').value==='\u4e2d\u6587\ud83d\ude00');
console.log('Base32Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
