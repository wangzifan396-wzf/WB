
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.tokenBucket(10,2,3,0)===6, 'tb 0+2*3=6');
ok(P.tokenBucket(10,2,100,0)===10, 'tb capped at cap');
ok(P.leakyBucket(10,2,3,10)===4, 'lb 10-2*3=4');
ok(P.leakyBucket(10,2,100,10)===0, 'lb floored 0');
var sw=P.slidingWindow(5,10,10,[1,2,3,9,15]);
ok(sw.count===4, 'sw count 4');
ok(sw.allowed===true, 'sw allowed');
ok(sw.remaining===1, 'sw remaining 1');
console.log('RateLimitForge _test: '+n+' passed, 0 failed');
