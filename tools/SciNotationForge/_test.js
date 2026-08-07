
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.toSci(12345); ok('toSci(12345) e=4', s.exponent===4 && Math.abs(s.mantissa-1.2345)<1e-9);
ok('toSci(0)', A.toSci(0).exponent===0 && A.toSci(0).mantissa===0);
ok('fromSci(1.2345,4)~12345', Math.abs(A.fromSci(1.2345,4)-12345)<1e-6);
ok('formatSci(12345) startsWith 1.2345', A.formatSci(12345).indexOf('1.2345')===0);
ok('add(2e3,3e3)=5000', A.add(2000,3000)===5000);
console.log('SciNotationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
