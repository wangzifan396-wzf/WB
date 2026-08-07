
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var t=A.cfExpand(1.5,10);
ok('cf 1.5 = [1,2]', JSON.stringify(t)==='[1,2]');
var conv=A.convergents(t);
ok('convergent 3/2 = 1.5', Math.abs(conv[conv.length-1][0]/conv[conv.length-1][1]-1.5)<1e-9);
var phi=A.cfExpand((1+Math.sqrt(5))/2,8);
ok('golden ratio all ones', phi.slice(0,6).every(function(v){return v===1;}));
console.log('ContinuedFractionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
