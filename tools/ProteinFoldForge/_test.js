
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.foldHP('HPPH'); ok('HPPH energy -1', r1.energy===-1);
var r2=A.foldHP('HHHH'); ok('HHHH energy -1', r2.energy===-1);
ok('path length', r1.path.length===4);
var seen={}, sa=true; r1.path.forEach(function(p){var k=p[0]+','+p[1]; if(seen[k])sa=false; seen[k]=1;}); ok('self-avoiding', sa);
ok('contacts HPPH', A.countContacts(r1.path,'HPPH')===1);
console.log('ProteinFoldForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
