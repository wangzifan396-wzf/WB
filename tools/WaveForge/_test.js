
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var s=P.waveInit(20,20);
ok(s.cur.length===400,'init size');
P.wavePoke(s,10,10,3);
ok(s.cur[10*20+10]===3,'poke sets amplitude');
var s1=P.waveStep(s,0.99);
ok(s1.cur.length===400,'step size');
ok(JSON.stringify(P.waveStep(s,0.99).cur)===JSON.stringify(s1.cur),'step deterministic');
var finite=true; for(var i=0;i<s1.cur.length;i++){ if(!isFinite(s1.cur[i])) finite=false; }
ok(finite,'all finite');
ok(s1.cur[10*20+10] < 3,'center decays after step');
ok(s1.cur[9*20+10] !== 0 || s1.cur[11*20+10] !== 0 || s1.cur[10*20+9] !== 0 || s1.cur[10*20+11] !== 0,'wave propagated to neighbors');
var s2=P.waveInit(20,20); P.wavePoke(s2,5,5,1);
for(var k=0;k<50;k++) s2=P.waveStep(s2,1.0);
var energy=0; for(var i=0;i<s2.cur.length;i++) energy+=s2.cur[i]*s2.cur[i];
ok(energy>0,'undamped energy persists');
var s3=P.waveInit(20,20); P.wavePoke(s3,5,5,1);
for(var k=0;k<80;k++) s3=P.waveStep(s3,0.95);
var e3=0; for(var i=0;i<s3.cur.length;i++) e3+=s3.cur[i]*s3.cur[i];
ok(e3 < 0.5,'damped energy decays to near zero');
console.log('PASS '+n+' assertions');
