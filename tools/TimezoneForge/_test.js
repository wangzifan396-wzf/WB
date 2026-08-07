
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var ny=A.tzParts(0,'America/New_York'); ok('NY 1969 19:00', ny.year==='1969' && ny.hour==='19');
var sh=A.tzParts(0,'Asia/Shanghai'); ok('SH 1970 08:00', sh.year==='1970' && sh.hour==='08');
console.log('TimezoneForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
