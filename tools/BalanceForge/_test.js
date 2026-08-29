
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.balanceEquation('H2 + O2 = H2O');
  ok('bal water', a.ok && a.balanced==='2H2 + O2 = 2H2O');
  var b=A.balanceEquation('CH4 + O2 = CO2 + H2O');
  ok('bal methane', b.ok && b.balanced==='CH4 + 2O2 = CO2 + 2H2O');
  var c=A.balanceEquation('Fe + O2 = Fe2O3');
  ok('bal rust', c.ok && c.balanced==='4Fe + 3O2 = 2Fe2O3');
  var d=A.balanceEquation('N2 + H2 = NH3');
  ok('bal ammonia', d.ok && d.balanced==='N2 + 3H2 = 2NH3');
  var e=A.balanceEquation('Ca(OH)2 + HCl = CaCl2 + H2O');
  ok('bal parens', e.ok && e.balanced==='Ca(OH)2 + 2HCl = CaCl2 + 2H2O');
  ok('bal bad side', A.balanceEquation('abc').ok===false);
  console.log(T.join('\n'));
  console.log('BAL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
