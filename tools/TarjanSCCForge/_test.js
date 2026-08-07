
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var nodes=['1','2','3','4','5','6','7','8'];
var edges=[['1','2'],['2','3'],['3','1'],['3','4'],['4','5'],['5','4'],['5','6'],['6','7'],['7','6'],['7','3']];
var scc=A.tarjanSCC(nodes,edges);
ok('2 components', scc.length===2);
function compOf(n){ for(var i=0;i<scc.length;i++) if(scc[i].indexOf(n)>=0) return i; return -1; }
ok('1..7 same SCC', compOf('1')===compOf('2')&&compOf('2')===compOf('3')&&compOf('3')===compOf('4')&&compOf('4')===compOf('5')&&compOf('5')===compOf('6')&&compOf('6')===compOf('7'));
var c8=compOf('8'); ok('8 alone', scc[c8].length===1 && scc[c8][0]==='8');
console.log('TarjanSCCForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
