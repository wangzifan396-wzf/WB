const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
function bytes(s){ return A.b85StrToBytes(s); }
// Ascii85 wikipedia vector
ok('a85 Man', A.b85Encode(bytes('Man ')).value==='<~9jqo^~>');
const wiki='Man is distinguished';
const encWiki=A.b85Encode(bytes(wiki)).value;
ok('a85 roundtrip wiki', A.b85BytesToStr(A.b85Decode(encWiki).value)===wiki);
ok('a85 z shortcut', A.b85Encode([0,0,0,0]).value==='<~z~>');
ok('a85 z decode', J(A.b85Decode('<~z~>').value)===J([0,0,0,0]));
ok('a85 partial tail', A.b85BytesToStr(A.b85Decode(A.b85Encode(bytes('sure.')).value).value)==='sure.');
ok('a85 empty', A.b85Encode([]).value==='<~~>');
ok('a85 bad char', A.b85Decode('<~ab\u007fcd~>').error!==null);
ok('a85 tail len1 error', A.b85Decode('<~a~>').error!==null);
ok('a85 z inside group error', A.b85Decode('<~abzcd~>').error!==null);
// utf8 helpers
ok('utf8 roundtrip cjk', A.b85BytesToStr(bytes('编码測試'))==='编码測試');
ok('utf8 cjk bytes', bytes('编').length===3);
// Z85 spec vector (ZeroMQ RFC 32): 0x86 0x4F 0xD2 0x6F 0xB5 0x59 0xF7 0x5B -> HelloWorld
ok('z85 spec vector', A.z85Encode([0x86,0x4F,0xD2,0x6F,0xB5,0x59,0xF7,0x5B]).value==='HelloWorld');
ok('z85 spec decode', J(A.z85Decode('HelloWorld').value)===J([0x86,0x4F,0xD2,0x6F,0xB5,0x59,0xF7,0x5B]));
ok('z85 unaligned error', A.z85Encode([1,2,3]).error!==null);
ok('z85 bad len error', A.z85Decode('abcd').error!==null);
ok('z85 bad char error', A.z85Decode('abc,e').error!==null);
ok('z85 roundtrip', A.b85BytesToStr(A.z85Decode(A.z85Encode(bytes('12345678')).value).value)==='12345678');
console.log('Base85Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
