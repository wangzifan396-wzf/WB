
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function u8a(s){ return Array.from(Buffer.from(s,'utf8')); }
ok('roundtrip Man', A.decode(A._enc(u8a('Man')))==='Man');
ok('enc length 3-byte -> 4', A._enc(u8a('Man')).length===4);
ok('roundtrip easy', A._dec(A._enc(u8a('easy'))).join('.')===u8a('easy').join('.'));
ok('roundtrip hello world', A._dec(A._enc(u8a('hello world'))).join('.')===u8a('hello world').join('.'));
ok('decode string', A.decode(A._enc(u8a('The quick brown fox')))==='The quick brown fox');
ok('zero compress', A._enc([0,0,0,0])==='z');
console.log('Ascii85Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
