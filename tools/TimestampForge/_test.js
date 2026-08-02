
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.tsToEpoch('0').epoch===0 && P.tsToEpoch('0').error===null,'zero epoch');
ok(P.tsToEpoch('1970-01-01 00:00:00').epoch===0,'epoch from date');
ok(P.tsToEpoch('not a date').error!==null,'bad date error');
ok(P.tsFromEpoch(0).iso==='1970-01-01T00:00:00.000Z','fromEpoch iso');
ok(P.tsFormat(0)==='1970-01-01 00:00:00','format zero');
ok(P.tsFormat(1234567890)==='2009-02-13 23:31:30','format known');
ok(P.tsToEpoch(P.tsFormat(1234567890)).epoch===1234567890,'roundtrip');
console.log('PASS '+n+' assertions');
