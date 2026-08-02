const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const rng=A.mulberry32(12345);
const a1=A.generate({length:16, rng:rng});
const a2=A.generate({length:16, rng:A.mulberry32(12345)});
ok('deterministic seed', a1.password===a2.password);
ok('length', a1.password.length===16);
ok('pool default size', a1.poolSize===62);
const rng2=A.mulberry32(7);
const b=A.generate({length:20, symbol:true, avoidAmbiguous:false, rng:rng2});
ok('symbol adds pool', b.poolSize===87);
ok('entropy formula', Math.abs(b.entropyBits - 20*(Math.log(87)/Math.log(2))) < 1e-6);
const c=A.generate({length:12, symbol:true, requireAll:true, rng:A.mulberry32(99)});
ok('requireAll has digit', /[0-9]/.test(c.password));
ok('requireAll has upper', /[A-Z]/.test(c.password));
ok('requireAll has lower', /[a-z]/.test(c.password));
ok('requireAll has symbol', /[!@#$%^&*()\-_=+\[\]{};:,.<>?]/.test(c.password));
const d=A.generate({length:10, avoidAmbiguous:true, rng:A.mulberry32(3)});
ok('avoid ambiguous', !/[Il1O0o]/.test(d.password));
const e=A.generate({length:8, lower:true, upper:false, digit:false, symbol:false, rng:A.mulberry32(5)});
ok('lowercase only charset', /^[a-z]+$/.test(e.password));
ok('returned charset', typeof e.charset==='string' && e.charset.length===26);
console.log('PasswordForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
