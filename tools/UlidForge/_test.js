
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var z = A.ulid(0, function(){return 0;});
ok('zero len', z.length === 26);
ok('zero time', A.decodeTime(z) === 0);
var u = A.ulid(1469918176385, function(){return 0;});
ok('time round', A.decodeTime(u) === 1469918176385);
ok('chars', A.ULID_CHARS.length === 32);
ok('random ok', /^[0-9A-Z]{26}$/.test(A.ulid(1000, Math.random)));
console.log('UlidForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
