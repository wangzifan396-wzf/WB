
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.dft([1,0,0,0],[0,0,0,0]);
ok('impulse DFT all re=1', r.re[0]===1 && r.re[1]===1 && r.re[3]===1);
ok('impulse DFT all im=0', r.im[0]===0 && r.im[2]===0);
ok('magnitude len4', A.magnitude(r.re[0],r.im[0])===1);
console.log('FourierForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
