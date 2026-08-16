
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var A2=[[1,2],[3,4]], B2=[[5,6],[7,8]];
ok('parse', JSON.stringify(A.parseMatrix('1 2\n3 4'))===JSON.stringify({m:A2}));
ok('add', JSON.stringify(A.add(A2,B2))===JSON.stringify([[6,8],[10,12]]));
ok('mul', JSON.stringify(A.mul(A2,B2))===JSON.stringify([[19,22],[43,50]]));
ok('trans', JSON.stringify(A.transpose(A2))===JSON.stringify([[1,3],[2,4]]));
ok('det', Math.abs(A.det(A2)-(-2))<1e-9);
ok('inv', (function(){var iv=A.inverse(A2); return Math.abs(iv[0][0]+2)<1e-9 && Math.abs(iv[1][1]+0.5)<1e-9 && Math.abs(iv[0][1]-1)<1e-9 && Math.abs(iv[1][0]-1.5)<1e-9;})());
ok('dim', !!A.det([[1,2,3],[4,5,6]]).error);
console.log('MatrixCalcForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
