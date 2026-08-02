
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var p=C.parse('3d6+2');ok('parse',p.count===3&&p.sides===6&&p.mod===2);
var r=C.roll({count:3,sides:6,rng:C.rngFrom(7)});ok('det',r.value.total===r.value.rolls.reduce(function(a,b){return a+b;},0));
var a=C.roll({count:2,sides:20,dropL:true,rng:C.rngFrom(3)});ok('adv keep2',a.value.rolls.length===2&&a.value.dropped.drop.length===1);
var bad=C.roll({count:0,sides:6});ok('bad',bad.error!=null);
console.log((fail?'FAIL':'PASS')+' DiceForge '+pass+'/'+fail);process.exit(fail?1:0);
