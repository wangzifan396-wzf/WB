
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('inv2',JSON.stringify(A.inv2([[4,7],[2,6]]))===JSON.stringify([[0.6,-0.7],[-0.2,0.4]]));
ok('det2',A.det2([[4,7],[2,6]])===10);
ok('inv2sing',A.inv2([[1,2],[2,4]])===null);
var I3=[[1,0,0],[0,1,0],[0,0,1]];var r3=A.inv3([[2,0,0],[0,2,0],[0,0,2]]);
ok('inv3',Math.abs(r3[0][0]-0.5)<1e-12 && Math.abs(r3[1][1]-0.5)<1e-12 && Math.abs(r3[2][2]-0.5)<1e-12);
ok('det3',A.det3(I3)===1);
ok('inv3sing',A.inv3([[1,2,3],[2,4,6],[7,8,9]])===null);
console.log('MatrixInverseForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
