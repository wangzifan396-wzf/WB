
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('vi',JSON.stringify(A.solve({v:12,i:2}))==='{"v":12,"i":2,"r":6,"p":24}');
var rp=A.solve({r:4,p:16});ok('rp',rp.v===8&&rp.i===2);
ok('vr',A.solve({v:10,r:5}).i===2);
ok('series',A.series([2,3])===5);
ok('parallel',A.parallel([2,2])===1);
ok('parallel0',A.parallel([0,2])===Infinity);
ok('err',A.solve({v:1}).error!==undefined);
console.log('OhmsForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
