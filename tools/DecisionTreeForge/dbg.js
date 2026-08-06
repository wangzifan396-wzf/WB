const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
console.error('html length', html.length);
const m=html.match(/<script>([\s\S]*?)<\/script>/);
console.error('m[1] length', m[1].length);
console.error('m[1] head', JSON.stringify(m[1].slice(0,60)));
const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
console.error('A keys', Object.keys(A), 'dtTrain type', typeof A.dtTrain);
var data=[]; for(var i=0;i<40;i++){ var v=i/39; data.push({x:[v,v], y: v<0.5?0:1}); }
var tree=A.dtTrain(data,[0,1],0,6);
console.error('pred', A.dtPredict(tree,[0.1,0.1]), A.dtPredict(tree,[0.9,0.9]));
