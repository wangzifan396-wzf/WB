
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var d=A.mathDrill({n:5, seed:3, ops:'+'});
  ok('drill 5 lines', d.split('\n').length===5);
  ok('drill has answer', /=\s*\d+$/.test(d.split('\n')[0]));
  ok('drill deterministic', A.mathDrill({n:5, seed:3, ops:'+'})===d);
  var h=A.mathDrill({n:3, seed:3, ops:'+', hideAnswers:true});
  ok('drill hide answers', h.split('\n').every(function(x){ return /=$/.test(x); }));
  var m=A.mathDrill({n:10, seed:5, ops:'*'});
  var multOk=m.split('\n').every(function(x){
    var p=x.split(' × '); if(p.length<2) return false;
    var a=+p[0].trim().split(/\s+/).pop(), b=+p[1].trim().split(/\s+/)[0];
    return a>=2 && b>=2;
  });
  ok('drill mult operands >=2', multOk);
  console.log(T.join('\n'));
  console.log('DRILL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
