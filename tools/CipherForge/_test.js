const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('caesar enc', A.caesar('ABC',1,false)==='BCD');
ok('caesar dec', A.caesar('BCD',1,true)==='ABC');
ok('caesar wrap', A.caesar('Z',1,false)==='A');
ok('caesar lower', A.caesar('a',1,false)==='b');
ok('vigenere enc', A.vigenere('ATTACK','LEMON',false)==='LXFOPV');
ok('vigenere dec', A.vigenere('LXFOPV','LEMON',true)==='ATTACK');
ok('rot13', A.rot13('HELLO')==='URYYB');
ok('rot13 roundtrip', A.rot13(A.rot13('HI'))==='HI');
ok('atbash', A.atbash('ABC')==='ZYX');
ok('atbash roundtrip', A.atbash(A.atbash('Test'))==='Test');
console.log('CipherForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
