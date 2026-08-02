
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
function lcg(seed){ return function(){ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; }; }
ok(P.pgCharset({upper:true,lower:true,digit:true,symbol:false}).length===62,'charset 62');
ok(P.pgCharset({symbol:true}).length===87,'charset with symbol');
var g=P.pgGenerate(12,{upper:true,lower:true,digit:true,symbol:false}, lcg(7));
ok(g.error===null && g.pw.length===12,'gen length');
var cs=P.pgCharset({upper:true,lower:true,digit:true,symbol:false}), allIn=true;
for(var i=0;i<g.pw.length;i++) if(cs.indexOf(g.pw[i])<0) allIn=false;
ok(allIn,'gen chars in charset');
var gs=P.pgGenerate(10,{symbol:true}, lcg(3)), css=P.pgCharset({symbol:true}), in2=true;
for(var j=0;j<gs.pw.length;j++) if(css.indexOf(gs.pw[j])<0) in2=false;
ok(in2,'gen with symbol in charset');
var full=P.pgCharset({upper:true,lower:true,digit:true,symbol:false});
ok(Math.abs(P.pgEntropy('aaaaaaaa',{upper:true,lower:true,digit:true,symbol:false}) - 8*Math.log2(full.length))<1e-9,'entropy');
ok(P.pgGenerate(0,{}).error!==null,'len 0 error');
console.log('PASS '+n+' assertions');
