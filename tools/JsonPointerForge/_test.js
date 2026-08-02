
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var o={a:{b:[10,20]}};
ok(P.jpGet(o,'/a/b/1')===20, 'get nested');
ok(P.jpGet(o,'')===o, 'get root');
P.jpSet(o,'/a/c','x'); ok(o.a.c==='x', 'set add');
ok(P.jpEscape('a/b~c')==='a~1b~0c', 'escape');
ok(P.jpUnescape('a~1b~0c')==='a/b~c', 'unescape');
console.log('JsonPointerForge _test: '+n+' passed, 0 failed');
