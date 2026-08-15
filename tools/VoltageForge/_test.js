
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('v',A.voltage(2,3)===6);
ok('i',A.current(6,3)===2);
ok('r',A.resistance(6,2)===3);
ok('p',A.power(6,2)===12);
ok('err',A.voltage(-1,3)===null);
console.log('VoltageForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
