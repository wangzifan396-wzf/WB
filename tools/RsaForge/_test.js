
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
C.generate(2048).then(function(r){
  ok('gen',!r.error);var kp=r.value;
  return C.encrypt(kp.publicKey,'topsecret').then(function(e){ok('enc',!e.error);return C.decrypt(kp.privateKey,e.value).then(function(d){ok('dec round',d.value==='topsecret');return C.sign(kp.privateKey,'hello').then(function(s){ok('sign',!s.error);return C.verify(kp.publicKey,'hello',s.value).then(function(v){ok('verify ok',v.value===true);return C.verify(kp.publicKey,'tampered',s.value).then(function(v2){ok('verify bad',v2.value===false);console.log((fail?'FAIL':'PASS')+' RsaForge '+pass+'/'+fail);process.exit(fail?1:0);});});});});});
}).catch(function(e){console.error(e);process.exit(1);});
