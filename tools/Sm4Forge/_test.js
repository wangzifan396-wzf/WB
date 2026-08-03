
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var key=[0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xef,0xfe,0xdc,0xba,0x98,0x76,0x54,0x32,0x10];
var rk=A.sm4KeyExp(A.bytesToWords(key));
ok('sm4 vec', A.wordsToHex(A.sm4EncBlock(A.bytesToWords(key),rk))==='681edf34d206965e86b3e94f536e4246');
var pt=[0x01,0x23,0x45,0x67,0x89,0xab,0xcd,0xef,0xfe,0xdc,0xba,0x98,0x76,0x54,0x32,0x10];
var ct=A.sm4EncBytes(pt,key); var back=A.sm4DecBytes(ct,key);
ok('sm4 rt', back.join(',')===pt.join(','));
var t='hello world'; var enc=A.sm4EncBytes(A.utf8(t),key); var d=A.sm4DecBytes(enc,key);
ok('sm4 text rt', A.utf8(t).join(',')===d.join(','));
ok('sm4 ct len mult16', ct.length%16===0);
console.log('Sm4Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
