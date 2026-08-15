
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('simp',JSON.stringify(A.simplify(1920,1080))===JSON.stringify({a:16,b:9}));
ok('simp2',JSON.stringify(A.simplify(10,5))===JSON.stringify({a:2,b:1}));
ok('prop',A.proportion(50,100,200)===100);
ok('asp',JSON.stringify(A.nearestAspect(1920,1080))===JSON.stringify({a:16,b:9}));
ok('err',A.simplify(0,5)===null);
console.log('RatioForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
