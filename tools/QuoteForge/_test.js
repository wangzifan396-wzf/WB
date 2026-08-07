
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var rng=A.mulberry32(12345); var q=A.pickQuote(rng,'编程');
ok('pickQuote returns object', q && typeof q.t==='string' && typeof q.a==='string');
ok('categories include 编程', A.categories().indexOf('编程')>=0);
var rng2=A.mulberry32(999); var q2=A.pickQuote(rng2,'幽默'); ok('pickQuote 幽默 valid', q2 && A.categories().indexOf(q2.c)>=0);
ok('pickQuote empty cat falls back', A.pickQuote(A.mulberry32(1),'不存在')!==undefined);
ok('QUOTES count', A.QUOTES.length>=15);
console.log('QuoteForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
