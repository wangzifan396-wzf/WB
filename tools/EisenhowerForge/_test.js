
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.classify([{text:'a',urgent:true,important:true},{text:'b',urgent:false,important:true},{text:'c',urgent:true,important:false},{text:'d',urgent:false,important:false}]);
ok('q1', r.q1.join('')==='a');
ok('q2', r.q2.join('')==='b');
ok('q3', r.q3.join('')==='c');
ok('q4', r.q4.join('')==='d');
ok('counts', r.counts.join(',')==='1,1,1,1');
console.log('EisenhowerForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
