
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var px=[[255,0,0],[0,255,0],[0,0,255]];
  var sp=A.splitChannels(px);
  ok('split r', sp.r.join(',')==='255,0,0');
  ok('split g', sp.g.join(',')==='0,255,0');
  ok('split b', sp.b.join(',')==='0,0,255');
  var comp=A.composeChannels(sp.r,sp.g,sp.b);
  ok('compose roundtrip', JSON.stringify(comp)===JSON.stringify(px));
  var sw=A.swapChannels(px,{r:'b',g:'g',b:'r'});
  ok('swap R<->B', JSON.stringify(sw)===JSON.stringify([[0,0,255],[0,255,0],[255,0,0]]));
  var gy=A.toGray([[255,255,255]],'lum');
  ok('gray white', gy[0][0]===255);
  ok('gray length', A.toGray(px,'avg').length===3);
  console.log(T.join('\n'));
  console.log('CHANNEL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
