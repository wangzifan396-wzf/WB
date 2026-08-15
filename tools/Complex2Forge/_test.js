
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('add',A.cadd([1,2],[3,4]).join(',')==='4,6');
ok('sub',A.csub([3,4],[1,2]).join(',')==='2,2');
ok('mul',A.cmul([1,2],[3,4]).join(',')==='-5,10');
ok('div',A.cdiv([1,0],[2,0]).join(',')==='0.5,0');
ok('mag',A.cmag([3,4])===5);
ok('conj',A.cconj([1,2]).join(',')==='1,-2');
var p=A.toPolar([3,4]); ok('polar',Math.abs(p[0]-5)<1e-9 && Math.abs(p[1]-Math.atan2(4,3))<1e-9);
ok('frompolar',Math.abs(A.fromPolar(5,Math.atan2(4,3))[0]-3)<1e-9);
ok('div0',A.cdiv([1,1],[0,0])===null);
console.log('Complex2Forge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
