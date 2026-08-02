
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
function eq(n,g,e){if(g===e)pass++;else{fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));}}
function run(){
  var key='000102030405060708090a0b0c0d0e0f';
  var jobs=[];
  ['GCM','CBC','CTR'].forEach(function(m){
    jobs.push(C.encrypt('hello world',key,m).then(function(e){
      ok('enc '+m,!e.error);
      return C.decrypt(e.value,key,m).then(function(d){eq('round '+m,d.value,'hello world');});
    }));
  });
  jobs.push(C.encrypt('x','zz','GCM').then(function(b){ok('badkey',b.error!=null);}));
  jobs.push(C.encryptPass('secret','pw','GCM').then(function(e){return C.decryptPass(e.value,'pw','GCM').then(function(d){eq('pass round',d.value,'secret');});}));
  Promise.all(jobs).then(function(){console.log((fail?'FAIL':'PASS')+' AesForge '+pass+'/'+fail);process.exit(fail?1:0);}).catch(function(e){console.error(e);process.exit(1);});
}
run();
