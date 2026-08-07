
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.format('select id,name from users where age>18 and active=1 order by name limit 10');
ok('newline before FROM', r.indexOf('\nFROM')>=0);
ok('newline before WHERE', r.indexOf('\nWHERE')>=0);
ok('uppercase SELECT', r.indexOf('SELECT')>=0);
ok('LIMIT 10', r.indexOf('LIMIT 10')>=0);
ok('no lowercase select', r.indexOf('select ')===-1);
console.log('SqlFormatForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
