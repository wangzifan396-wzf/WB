
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.skeletonCss({height:20, radius:8, gap:12});
  ok('skel height', s.indexOf('height: 20px;')>=0);
  ok('skel radius', s.indexOf('border-radius: 8px;')>=0);
  ok('skel gap', s.indexOf('margin-bottom: 12px;')>=0);
  ok('skel keyframes', s.indexOf('@keyframes skeleton-shimmer')>=0);
  ok('skel color', A.skeletonCss({color:'#111111'}).indexOf('#111111')>=0);
  console.log(T.join('\n'));
  console.log('SKEL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
