
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var c1=P.gridCss({cols:3, colUnit:'1fr'});
ok(c1.indexOf('grid-template-columns:1fr 1fr 1fr')>=0, '3 cols 1fr');
ok(c1.indexOf('gap:8px')>=0, 'default gap');
var c2=P.gridCss({cols:2, rows:2, colUnit:'100px', rowUnit:'50px', gap:0});
ok(c2.indexOf('grid-template-rows:50px 50px')>=0, 'rows');
ok(P.gridAreas(['a','b','c','d'],2).indexOf('grid-template-areas:"a b" "c d"')>=0, 'areas');
console.log('GridForge _test: '+n+' passed, 0 failed');
