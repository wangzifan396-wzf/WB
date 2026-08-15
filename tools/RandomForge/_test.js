
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.randInt(rngFactory(5),1,6);ok('int range',r1>=1&&r1<=6);
var r2=A.randInt(rngFactory(5),1,6);ok('deterministic',r1===r2);
ok('dice',A.dice(rngFactory(9),6)>=1&&A.dice(rngFactory(9),6)<=6);
var sh=A.shuffle([1,2,3,4],rngFactory(3));ok('shuffle',sh.length===4&&sh.slice().sort().join(',')==='1,2,3,4');
var sh2=A.shuffle([1,2,3,4],rngFactory(3));ok('sh det',sh.join(',')===sh2.join(','));
console.log('RandomForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
