
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var log='2026-08-19 10:00 INFO 1.2.3.4 ok\n2026-08-19 10:01 ERROR 1.2.3.4 fail\n2026-08-19 10:02 WARN 5.6.7.8 x';
var r=A.analyze(log);
ok('total', r.total===3);
ok('levels', r.levels.ERROR===1 && r.levels.WARN===1 && r.levels.INFO===1);
ok('errors', r.errorCount===1);
ok('ip', r.topIp.length>=1 && r.topIp[0].ip==='1.2.3.4');
ok('buckets', Object.keys(r.buckets).length>=1);
ok('empty', A.analyze('').total===0);
console.log('LogAnalyzerForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
