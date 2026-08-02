
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var s=P.rdInit(40,40);
ok(s.B.length===1600,'init size');
ok(P.rdSumB(s)>0,'seed B present');
var s1=P.rdStep(s,0.055,0.062,1.0,0.5,1.0);
ok(P.rdSumB(s1)>0,'B remains after step');
ok(JSON.stringify(P.rdStep(s,0.055,0.062,1.0,0.5,1.0).B)===JSON.stringify(s1.B),'deterministic');
var finite=true; for(var i=0;i<s1.B.length;i++){ if(!isFinite(s1.B[i])) finite=false; }
ok(finite,'all finite');
var bounded=true; for(var i=0;i<s1.B.length;i++){ if(s1.B[i]<-1e-9||s1.B[i]>1+1e-9) bounded=false; }
ok(bounded,'B in [0,1]');
for(var k=0;k<80;k++) s1=P.rdStep(s1,0.055,0.062,1.0,0.5,1.0);
ok(isFinite(P.rdSumB(s1)),'long run finite');
ok(P.rdSumB(s1)>0 && P.rdSumB(s1)<=1600,'long run B bounded');
console.log('PASS '+n+' assertions');
