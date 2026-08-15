
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('init', JSON.stringify(A.initBoxes(3))==='[0,0,0]');
ok('promote', A.promote(0)===1 && A.promote(5)===5);
ok('demote', A.demote(3)===0);
ok('dueInDays', A.dueInDays(0)===0 && A.dueInDays(5)===30);
ok('isDue true', A.isDue(0,5, 1000+40*86400000)===true);
ok('isDue false', A.isDue(1000,5, 1000+10*86400000)===false);
console.log('LearnForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
