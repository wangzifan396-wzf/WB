
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g1=A.bfs(['A','B','C'], [['A','B'],['B','C']], 'A');
ok('bfs line A→B→C', JSON.stringify(g1)==='["A","B","C"]');
var g2=A.bfs(['A','B','C','D'], [['A','B'],['A','C'],['C','D']], 'A');
ok('bfs branch A→B,C,D', JSON.stringify(g2)==='["A","B","C","D"]');
ok('bfs start isolated', JSON.stringify(A.bfs(['A','B'], [], 'A'))==='["A"]');
console.log('BfsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
