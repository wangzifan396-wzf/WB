
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.swFormat(0)==='00:00.000','zero');
ok(P.swFormat(65000)==='01:05.000','65s');
ok(P.swFormat(3661000)==='01:01:01.000','1h1m1s');
var L=P.swLaps([1000,2000,1500]);
ok(L.total===4500 && L.best===1000 && L.worst===2000,'laps');
ok(P.swLaps([]).total===0,'empty laps');
console.log('PASS '+n+' assertions');
