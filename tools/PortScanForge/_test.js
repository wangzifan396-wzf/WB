
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r1=A.expandPorts('80,443,8000-8002,22');
  ok('port valid', r1.valid===true);
  ok('port count', r1.count===6);
  ok('port has 443', r1.ports.indexOf(443)>=0);
  ok('port named http', (function(){ for(var i=0;i<r1.named.length;i++) if(r1.named[i].port===80) return true; return false; })());
  var r2=A.expandPorts('10-5');
  ok('port bad range', r2.invalid.length===1);
  var r3=A.expandPorts('99999');
  ok('port bad num', r3.valid===false);
  ok('port empty', A.expandPorts('').valid===false);
  console.log(T.join('\n'));
  console.log('PORT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
