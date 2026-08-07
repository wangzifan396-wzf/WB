
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('1920x1080=16:9', A.simplify(1920,1080)==='16:9');
ok('gcd', A.gcd(1920,1080)===120);
ok('scale 16:9 @1280 -> 720', A.scale(16,9,{width:1280})===720);
ok('scale 16:9 @720w -> 405', A.scale(16,9,{height:405})===720);
ok('preset count', A.PRESETS.length>=8);
console.log('AspectRatioForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
