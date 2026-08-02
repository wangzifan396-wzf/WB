
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var r=P.spParse('v=spf1 a mx -all');
ok(r.ok && r.mechanisms.length===3,'parse 3 mechs');
ok(r.mechanisms[2].mechanism==='all' && r.mechanisms[2].qualifier==='-','last hardfail');
var r2=P.spParse('v=spf1 include:_spf.google.com include:_spf.mail.com -all');
ok(P.spDnsLookups(r2.mechanisms)===2,'2 dns lookups');
var s1=P.spScore(r.mechanisms);
ok(s1.grade==='A' && s1.score===100,'strong spf A');
ok(s1.lookups===2,'a+mx count as dns lookups');
var s2=P.spScore(r2.mechanisms);
ok(s2.lookups===2 && s2.score>=90,'include still high');
var open=P.spScore(P.spParse('v=spf1 +all').mechanisms);
ok(open.score<100 && open.grade!=='A','+all lowers');
var ptr=P.spScore(P.spParse('v=spf1 ptr:foo.com -all').mechanisms);
ok(ptr.score<100,'ptr penalty');
ok(P.spExplainQual('-')==='硬失败（拒绝）','qual text');
ok(P.spParse('not spf').ok===false,'invalid record');
ok(P.spParse('v=spf1 a mx ip4:1.2.3.0/24 ~all').mechanisms.some(function(x){return x.mechanism==='ip4';}),'ip4 mech');
ok(P.spScore(P.spParse('v=spf1 -all').mechanisms).score>=80,'minimal spf decent');
console.log('PASS '+n+' assertions');
