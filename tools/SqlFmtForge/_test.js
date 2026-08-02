
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var a=P.sqlFormat('select a,b from t where x=1');
ok(a.sql.indexOf('SELECT')>=0 && a.sql.indexOf('\nFROM')>=0 && a.sql.indexOf('\nWHERE')>=0,'clause newlines');
var b=P.sqlFormat("select * from t where name='a B c'");
ok(b.sql.indexOf("name='a B c'")>=0,'string preserved');
ok(b.sql.indexOf('SELECT')>=0,'upper keyword');
ok(P.sqlFormat(null).error!==null,'null error');
ok(P.sqlFormat('SELECT a FROM t').sql.indexOf('FROM')>=0,'idempotent-ish');
console.log('PASS '+n+' assertions');
