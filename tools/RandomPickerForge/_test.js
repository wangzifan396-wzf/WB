
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var L=[1,2,3,4,5]; var s=A.shuffle(L); ok('shuffle length', s.length===5); ok('shuffle is perm', JSON.stringify(s.slice().sort())===JSON.stringify([1,2,3,4,5]));
ok('pick in list', L.indexOf(A.pick(L))>=0);
var sm=A.sample(L,3); ok('sample 3 unique', sm.length===3 && new Set(sm).size===3);
ok('sample>=len returns all', A.sample(L,9).length===5);
var r1=A.mulberry32(12345), r2=A.mulberry32(12345); var a=[],b=[];
for(var i=0;i<6;i++){ a.push(Math.floor(r1()*1000)); b.push(Math.floor(r2()*1000)); }
ok('seed deterministic', JSON.stringify(a)===JSON.stringify(b));
ok('weightedPick returns item', ["x","y","z"].indexOf(A.weightedPick(["x","y","z"],[1,1,1]))>=0);
console.log('RandomPickerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
