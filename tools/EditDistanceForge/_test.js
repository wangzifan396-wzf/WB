
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('kitten/sitting =3', A.lev("kitten","sitting")===3);
ok('empty/abc =3', A.lev("","abc")===3);
ok('same =0', A.lev("same","same")===0);
ok('flaw/lawn =2', A.lev("flaw","lawn")===2);
console.log('EditDistanceForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
