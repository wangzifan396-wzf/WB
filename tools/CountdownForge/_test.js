
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.countdownParse('2026-12-31 23:59') instanceof Date,'parse space');
ok(P.countdownParse('2026-12-31T23:59') instanceof Date,'parse T');
ok(P.countdownParse('garbage')===null,'parse bad');
ok(P.countdownParse('')===null,'parse empty');
var now=new Date('2026-01-01T00:00:00');
var fut=new Date('2026-01-03T03:04:05');
var r=P.countdownRemain(fut, now);
ok(r.done===false && r.d===2 && r.h===3 && r.m===4 && r.s===5,'remain decompose');
var past=P.countdownRemain(new Date('2025-01-01'), now);
ok(past.done===true && past.d===0,'past done');
ok(P.countdownRemain(fut.toISOString(), now).d===2,'iso string input');
console.log('PASS '+n+' assertions');
