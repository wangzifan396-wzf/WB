
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('avatar initial', A.avatarText('alice').initial==='A');
  ok('avatar empty', A.avatarText('').initial==='?');
  ok('avatar deterministic', A.avatarText('bob').hue===A.avatarText('bob').hue);
  ok('avatar hue range', A.avatarText('zoe').hue>=0 && A.avatarText('zoe').hue<360);
  ok('avatar bg hsl', A.avatarText(' Atlas ').bg.indexOf('hsl(')===0);
  ok('avatar round default', A.avatarText('a').radius==='50%');
  ok('avatar square', A.avatarText('a',{round:false}).radius==='12px');
  ok('avatar size', A.avatarText('a',{size:64}).size===64);
  var h1=A.hashString('abc'); ok('avatar hash stable', h1===A.hashString('abc') && h1>=0);
  console.log(T.join('\n'));
  console.log('AVATAR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
