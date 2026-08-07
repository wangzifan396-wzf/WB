
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('enc("a b&c=")', A.enc("a b&c=")==="a%20b%26c%3D");
ok('dec("a%20b")', A.dec("a%20b")==="a b");
var pq=A.parseQuery("a=1&b=2&a=3"); ok('parseQuery dup->array', Array.isArray(pq.a) && pq.a.length===2 && pq.a[0]==='1' && pq.b==='2');
ok('buildQuery', A.buildQuery({a:1,b:2})==="a=1&b=2");
var u=A.parseUrl("https://x.com/p?a=1#h"); ok('parseUrl', u.authority==="x.com" && u.path==="/p" && u.query==="a=1" && u.hash==="#h" && u.params.a==="1");
ok('encFull keeps ://', A.encFull("https://x.com/a b")==="https://x.com/a%20b");
ok('roundtrip 中文', A.dec(A.enc("中文测试"))==="中文测试");
console.log('URLEncodeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
