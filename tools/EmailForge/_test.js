
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r1=A.parseEmail('alice.smith+tag@example.com');
  ok('email valid', r1.valid===true);
  ok('email local', r1.local==='alice.smith+tag');
  ok('email domain', r1.domain==='example.com');
  ok('email tld', r1.tld==='com');
  ok('email no errors', r1.errors.length===0);
  ok('email empty', A.parseEmail('').valid===false);
  var r2=A.parseEmail('bad@');
  ok('email no domain', r2.valid===false);
  var r3=A.parseEmail('a@b..com');
  ok('email double dot', r3.valid===false);
  var r4=A.parseEmail('a@b.c');
  ok('email short tld', r4.valid===false);
  console.log(T.join('\n'));
  console.log('EMAIL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
