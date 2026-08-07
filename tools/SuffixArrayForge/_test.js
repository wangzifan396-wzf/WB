
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sa=A.buildSA("banana");
ok('SA len 6', sa.length===6);
ok('SA[0]=5 (suffix "a")', sa[0]===5);
ok('count ana=2', A.count("banana","ana")===2);
ok('count xyz=0', A.count("banana","xyz")===0);
ok('count an=2', A.count("banana","an")===2);
var L=A.lcp("banana", sa);
ok('lcp array len 6', L.length===6);
console.log('SuffixArrayForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
