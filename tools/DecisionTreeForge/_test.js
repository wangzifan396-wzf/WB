
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var data=[]; for(var i=0;i<40;i++){ var v=i/39; data.push({x:[v,v], y: v<0.5?0:1}); }
var tree=A.dtTrain(data,[0,1],0,6);
ok('dt left region', A.dtPredict(tree,[0.1,0.1])===0);
ok('dt right region', A.dtPredict(tree,[0.9,0.9])===1);
ok('dt threshold', A.dtPredict(tree,[0.49,0.5])===0 && A.dtPredict(tree,[0.51,0.5])===1);
var pure=A.dtTrain([{x:[0,0],y:0},{x:[1,1],y:1}], [0,1],0,1);
ok('dt trivial', A.dtPredict(pure,[0,0])===0 && A.dtPredict(pure,[1,1])===1);
console.log('DecisionTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
