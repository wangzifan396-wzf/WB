
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var nodes=['A','B','C','D']; var edges=[['A','B'],['B','C'],['C','D'],['D','A']];
var r=A.forceLayout(nodes,edges,{seed:7,iterations:200,width:100,height:100});
ok('count 4', r.length===4);
ok('finite', r.every(function(p){return isFinite(p.x)&&isFinite(p.y);}));
var xs=r.map(function(p){return p.x;}); ok('spread', (Math.max.apply(null,xs)-Math.min.apply(null,xs))>0.5);
console.log('ForceLayoutForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
