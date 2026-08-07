
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('T in (0,1] E<V0', (function(){var T=A.transmission(1e-19,2e-19,1e-9);return T>0&&T<=1;})());
ok('T~1 E>>V0', (function(){var T=A.transmission(10e-19,1e-19,1e-9);return T>0.9&&T<=1;})());
ok('invalid NaN', isNaN(A.transmission(0,1,1)));
console.log('QuantumTunnelForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
