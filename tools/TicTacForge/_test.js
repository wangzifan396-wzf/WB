
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var b1=['X','X',null,'O','O',null,null,null,null];
  ok('ttt win move', A.tttMove(b1.slice(),'X').move===2);
  var b2=[null,null,null,null,null,null,null,null,null];
  var mv=A.tttMove(b2.slice(),'O').move; ok('ttt valid move', mv>=0 && mv<9);
  ok('ttt draw detect', A.tttWinner(['X','O','X','X','O','O','O','X','X'])==='draw');
  console.log(T.join('\n'));
  console.log('TIC_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
