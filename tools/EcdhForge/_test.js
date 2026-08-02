
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
C.generate().then(function(a){C.generate().then(function(b){
  ok('gen a',!a.error);ok('gen b',!b.error);
  return C.derive(a.value.privateKey,b.value.publicKey).then(function(ra){
    return C.derive(b.value.privateKey,a.value.publicKey).then(function(rb){
      ok('equal',ra.value===rb.value);
      ok('len32',ra.value.length>0);
      console.log((fail?'FAIL':'PASS')+' EcdhForge '+pass+'/'+fail);process.exit(fail?1:0);
    });
  });
});}).catch(function(e){console.error(e);process.exit(1);});
