
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var map=P.hhParse('X-Frame-Options: DENY\nContent-Type: text/html');
ok(map['x-frame-options']==='DENY','key lowercased');
ok(map['content-type']==='text/html','second header');
var good='Strict-Transport-Security: max-age=31536000; includeSubDomains\nContent-Security-Policy: default-src \'self\'\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nReferrer-Policy: no-referrer\nPermissions-Policy: geolocation=()\nCross-Origin-Opener-Policy: same-origin\nCross-Origin-Resource-Policy: same-origin';
var r1=P.hhAnalyze(good);
ok(r1.score===100 && r1.grade==='A','all headers -> 100');
ok(r1.results.length===8,'8 checks');
var weak='Server: nginx\nContent-Type: text/html';
var r2=P.hhAnalyze(weak);
ok(r2.score<60 && r2.grade!=='A','weak headers low score');
ok(r2.results.every(function(x){return !x.pass;}),'no security header passes');
var hsts0=P.hhAnalyze('Strict-Transport-Security: max-age=0');
ok(hsts0.results[0].pass===false,'hsts max-age=0 fails');
var csp=P.hhAnalyze('Content-Security-Policy: default-src self');
ok(csp.results[1].present && csp.results[1].pass,'csp present passes');
ok(P.hhParse('a: b: c').a==='b: c','colon in value ok');
ok(P.hhAnalyze('x-frame-options: sameorigin').results[2].pass,'xfo sameorigin passes');
ok(P.HH_CHECKS.length===8,'HH_CHECKS exposed');
console.log('PASS '+n+' assertions');
