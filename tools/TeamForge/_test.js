
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.splitTeams('a b c d',{teams:2,seed:1});
  ok('team count', a.count===2 && a.total===4);
  var sum=0; for(var i=0;i<a.teams.length;i++) sum+=a.teams[i].length;
  ok('team all assigned', sum===4);
  ok('team deterministic', JSON.stringify(A.splitTeams('a b c d',{teams:2,seed:1}).teams)===JSON.stringify(a.teams));
  ok('team clamp', A.splitTeams('a b',{teams:5,seed:1}).count===2);
  ok('team balanced', A.splitTeams('a b c d e',{teams:2,seed:3}).teams.map(function(t){return t.length;}).join(',')==='3,2');
  ok('team empty', A.splitTeams('',{teams:2}).total===0);
  console.log(T.join('\n'));
  console.log('TEAM_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
