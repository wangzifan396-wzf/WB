
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.hsClass(200).indexOf('2xx')===0,'class 2xx');
ok(P.hsClass(404).indexOf('4xx')===0,'class 4xx');
ok(P.hsClass(99)===null && P.hsClass(600)===null,'class out of range');
ok(P.hsLookup(404).name==='Not Found','lookup 404');
ok(P.hsLookup('200').name==='OK','lookup string code');
ok(P.hsLookup(299).known===false,'unknown code flagged');
ok(P.hsLookup(700).error!==null,'invalid code error');
ok(P.hsRetriable(503) && P.hsRetriable(429),'retriable 5xx/429');
ok(!P.hsRetriable(404) && !P.hsRetriable(200),'not retriable');
ok(P.hsCacheable(200) && P.hsCacheable(301) && P.hsCacheable(404),'cacheable set');
ok(!P.hsCacheable(500),'500 not cacheable');
ok(P.hsSearch('gateway').length===2,'search gateway');
ok(P.hsSearch('40').every(function(r){ return String(r.code).indexOf('40')===0; }),'search prefix');
ok(P.hsSearch('').length===Object.keys(P.HS_DATA).length,'search all');
ok(P.hsSearch('zzz').length===0,'search none');
const sorted=P.hsSearch('');
ok(sorted[0].code<sorted[sorted.length-1].code,'sorted asc');
ok(P.hsLookup(418).name==='I am a teapot','teapot');
console.log('PASS '+n+' assertions');
