
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var p={A1:1,A2:1,A3:1,A4:1,f1:2,f2:3,f3:2,f4:3,p1:0,p2:1.57,p3:0.78,p4:0,d1:0.004,d2:0.004,d3:0.004,d4:0.004};
var a=P.hmgPoints(p), b=P.hmgPoints(p);
ok(a.length===2200,'default point count');
ok(JSON.stringify(a)===JSON.stringify(b),'deterministic');
var finite=a.every(function(q){ return isFinite(q.x)&&isFinite(q.y); });
ok(finite,'all points finite');
var bounded=a.every(function(q){ return Math.abs(q.x)<=2.001 && Math.abs(q.y)<=2.001; });
ok(bounded,'points bounded by amplitudes');
var p2=Object.assign({},p,{N:500});
ok(P.hmgPoints(p2).length===500,'N controls count');
var p3=Object.assign({},p,{d1:0,d2:0,d3:0,d4:0});
var c=P.hmgPoints(p3);
var r=c[0].x*c[0].x+c[0].y*c[0].y;
ok(r>0.5,'undamped start amplitude large');
console.log('PASS '+n+' assertions');
