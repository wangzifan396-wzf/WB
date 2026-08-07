
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.generate(2);
ok('setup+punch', !!(r.setup&&r.punch));
ok('deterministic', r.setup===A.generate(2).setup);
ok('setup non-empty', typeof r.setup==='string' && r.setup.length>0);
console.log('JokeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
