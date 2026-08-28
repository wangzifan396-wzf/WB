
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('size MB->KB 1024', A.convertSize(1,'MB','KB',1024).value===1024);
  ok('size MB->KB 1000', A.convertSize(1,'MB','KB',1000).value===1000);
  ok('size KB->B', A.convertSize(1,'KB','B',1024).value===1024);
  ok('size bad unit', A.convertSize(1,'XX','B',1024).ok===false);
  console.log(T.join('\n'));
  console.log('SIZE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
