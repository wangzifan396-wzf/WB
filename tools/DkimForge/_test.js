
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var LONG='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA';
LONG=LONG+LONG+LONG+LONG+LONG+LONG+LONG+LONG;
var rec=P.dkParse('v=DKIM1; k=rsa; t=s; h=sha256; p='+LONG);
ok(rec.ok && rec.tags.v==='DKIM1','parse ok');
ok(rec.tags.k==='rsa','parse k');
ok(rec.tags.p.length>0,'parse p');
ok(P.dkKeyBits(rec.tags.p)>=2048,'bits >=2048');
var s1=P.dkScore(rec.tags);
ok(s1.grade==='A' && s1.score===100,'strong dkim A');
ok(s1.bits>=2048,'bits reported');
var weak=P.dkParse('v=DKIM1; p=short');
ok(weak.ok && P.dkScore(weak.tags).grade!=='A','short key not A');
var noP=P.dkParse('v=DKIM1; k=rsa');
ok(noP.ok===false,'missing p not ok');
ok(P.dkKeyBits('')===0,'bits empty');
ok(P.dkKeyBits(null)===0,'bits null');
var seg=P.dkParse('v=DKIM1 ; k = ed25519 ; p = abc');
ok(seg.tags.k==='ed25519' && seg.tags.p==='abc','spaced tags');
ok(P.dkScore(seg.tags).checks.length===7,'7 checks');
ok(P.dkScore({v:'DKIM1',p:LONG}).checks.some(function(c){return c.name==='指定密钥算法 k' && !c.pass;}),'missing k fails');
console.log('PASS '+n+' assertions');
