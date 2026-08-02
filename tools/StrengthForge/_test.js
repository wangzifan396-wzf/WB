
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
const close=function(a,b,e){ return Math.abs(a-b)<(e||1e-6); };
const SYM=P.STRENGTH_SYMBOLS.length;
ok(P.strengthCharset('aaaa')===26,'lowercase only=26');
ok(P.strengthCharset('aA1!')===(26+26+10+SYM),'mixed charset');
ok(close(P.strengthEntropy('aaaa'),4*Math.log(26)/Math.log(2)),'entropy aaaa');
ok(close(P.strengthEntropy('aA1!'),4*Math.log(26+26+10+SYM)/Math.log(2)),'entropy mixed');
ok(P.strengthScore(20)===0,'score weak');
ok(P.strengthScore(40)===2,'score medium');
ok(P.strengthScore(200)===4,'score very strong');
const a=P.strengthAnalyze('123456');
ok(a.warnings.indexOf('命中常见弱口令字典')>=0,'common weak detected');
const b=P.strengthAnalyze('aaaa');
ok(b.warnings.indexOf('全部字符重复')>=0,'repeated detected');
const c=P.strengthAnalyze('abcdef');
ok(c.warnings.indexOf('连续字母序列')>=0,'sequence detected');
const d=P.strengthAnalyze('Tr0ub4dour&3');
ok(d.score>=2,'respectable pw score');
ok(P.strengthAnalyze('').empty===true,'empty flag');
ok(P.strengthRand(20).length===20,'rand length');
ok(P.strengthCrack(80).indexOf('年')>0,'crack time years');
console.log('PASS '+n+' assertions');
