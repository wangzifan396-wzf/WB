
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var all=A.qm(4,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);ok('all1',all.expression==='1');
var odd=A.qm(3,[1,3,5,7]);ok('oddC',odd.expression.indexOf('C')>=0);
var two=A.qm(2,[1,2]);ok('twoCov',two.implicants.length>=1 && [1,2].every(function(t){return two.implicants.some(function(im){return im.terms.indexOf(t)>=0;});}) && two.expression.length>0);
var even=A.qm(4,[0,2,4,6,8,10,12,14]);ok('evenD',even.expression.indexOf('¬D')>=0);
console.log('KarnaughForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
