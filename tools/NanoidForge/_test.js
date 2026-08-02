
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
function lcg(seed){ return function(){ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; }; }
ok(P.nidAlphabet('url').length===64,'url 64');
ok(P.nidAlphabet('hex').length===16,'hex 16');
var g=P.nidGenerate(8, P.nidAlphabet('url'), lcg(9));
ok(g.id.length===8,'gen len');
var cs=P.nidAlphabet('url'), ina=true; for(var i=0;i<g.id.length;i++) if(cs.indexOf(g.id[i])<0) ina=false;
ok(ina,'gen in alphabet');
ok(/^[0-9a-f]+$/.test(P.nidGenerate(10, P.nidAlphabet('hex'), lcg(2)).id),'hex only');
ok(P.nidGenerate(0, P.nidAlphabet('url')).error!==null,'len 0 error');
ok(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(P.nidUuid()),'uuid format');
console.log('PASS '+n+' assertions');
