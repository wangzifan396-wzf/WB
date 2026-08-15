
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var br=[{upTo:10000,rate:0.1},{upTo:40000,rate:0.2},{upTo:Infinity,rate:0.3}];
ok('t1',Math.abs(A.tax(5000,br).tax-500)<1e-9);
ok('t2',Math.abs(A.tax(50000,br).tax-10000)<1e-9);
ok('eff',Math.abs(A.tax(50000,br).effective-0.2)<1e-9);
ok('marg',A.tax(50000,br).marginal===0.3);
ok('err',A.tax(-1,br)===null);
console.log('TaxBracketForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
