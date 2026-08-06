
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('hit center', A.hitTest(0,0,0,0,10) === true);
ok('hit edge', A.hitTest(10,0,0,0,10) === true);
ok('miss', A.hitTest(15,0,0,0,10) === false);
ok('rating god', A.rating(1) === "神射手");
ok('rating new', A.rating(0.3) === "继续练习");
ok('rating mid', A.rating(0.85) === "高手");
console.log('AimForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
