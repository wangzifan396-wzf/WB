
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.schedule(12000,0.12,12);
ok('pmt ~1066.17', Math.abs(s.pmt-1066.17)<0.5);
ok('rows length 12', s.rows.length===12);
ok('last balance 0', s.rows[11].balance===0);
ok('schedule 0 rate', Math.abs(A.schedule(1200,0,12).pmt-100)<1e-9);
console.log('AmortizationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
