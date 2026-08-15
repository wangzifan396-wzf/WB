
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('d2r',Math.abs(A.deg2rad(180)-Math.PI)<1e-9);
ok('r2d',Math.abs(A.rad2deg(Math.PI)-180)<1e-9);
ok('comp',A.complement(30)===60);
ok('supp',A.supplement(120)===60);
ok('tri',A.triangleThird(60,60)===60);
ok('norm',A.normalize(450)===90);
ok('comperr',A.complement(100)===null);
console.log('AngleForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
