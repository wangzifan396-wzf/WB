
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var r=P.sqlExplain('SELECT a, b FROM t WHERE x = 1 AND y > 2 ORDER BY a LIMIT 10');
ok(r.valid, 'valid');
ok(r.select.length===2 && r.select[0]==='a' && r.select[1]==='b', 'select 2 cols');
ok(r.from==='t', 'from t');
ok(r.where.length===2, 'where 2 conds');
ok(r.orderBy==='a', 'orderBy a');
ok(r.limit===10, 'limit 10');
var r2=P.sqlExplain('SELECT u.id FROM users u JOIN orders o ON u.id = o.uid WHERE u.vip = 1');
ok(r2.valid, 'join valid');
ok(r2.joins.length===1 && r2.joins[0].table==='orders', 'join table');
var r3=P.sqlExplain('garbage');
ok(r3.valid===false, 'invalid sql');
console.log('SqlExplainForge _test: '+n+' passed, 0 failed');
