
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sq=[[0,0],[10,0],[10,10],[0,10],[5,5],[3,3]];
var h=A.chHull(sq);
ok('hull len 4', h.length===4);
ok('has corner', h.some(function(p){return p[0]===0&&p[1]===0;}) && h.some(function(p){return p[0]===10&&p[1]===10;}));
ok('perim', Math.abs(A.chPerim([[0,0],[10,0],[10,10],[0,10]])-40)<1e-9);
console.log('ConvexHullForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
