
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var r1=P.coAnalyze({origin:'https://a.com'});
ok(r1.score===100 && r1.level==='正常','specific origin ok');
ok(r1.wildcard===false && r1.multiple===false,'no wild/multi');
var r2=P.coAnalyze({origin:'*', credentials:true});
ok(r2.level==='危险' && r2.wildcard===true,'wild+cred dangerous');
ok(r2.problems.length>=1 && r2.score<100,'wild+cred penalized');
var r3=P.coAnalyze({origin:'a.com b.com'});
ok(r3.multiple===true && r3.score<100,'multi origin penalized');
var r4=P.coAnalyze({});
ok(r4.score<100 && r4.problems.length>=1,'empty penalized');
var r5=P.coAnalyze({origin:'https://a.com', credentials:true});
ok(r5.score>=90 && r5.credentials===true,'specific+cred fine');
ok(P.coAnalyze({origin:'*'}).score===100,'wild no cred fine');
ok(P.coAnalyze({origin:'*', credentials:false, methods:'GET'}).wildcard===true,'wild flag');
ok(P.coAnalyze({origin:'x y z'}).multiple===true,'three origins multi');
ok(P.coAnalyze({origin:'https://a.com'}).grade==='A','grade A');
console.log('PASS '+n+' assertions');
