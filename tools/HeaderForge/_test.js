
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var h=A.parseHeaders('A: 1\nB: 2');
  ok('hdr parse count', h.length===2);
  ok('hdr parse field', h[0].name==='A' && h[0].value==='1');
  ok('hdr build', A.buildHeaders([{name:'A',value:'1'},{name:'B',value:'2'}])==='A: 1\nB: 2');
  ok('hdr roundtrip', A.buildHeaders(A.parseHeaders('A:1\n\nB: 2'))==='A: 1\nB: 2');
  ok('hdr common', A.commonHeaders().length>=5);
  console.log(T.join('\n'));
  console.log('HDR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
