
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var d=C.df('Filesystem 1K-blocks Used Available Use% Mounted\n/dev/sda1 500G 200G 280G 42% /').value;
ok('df', d.length===1 && d[0].use==='42%' && d[0].mounted==='/');
var p=C.ping('time=12.3 ms\ntime=11.9 ms').value;
ok('ping', p.rtt.length===2 && p.rtt[0]===12.3);
ok('ls', C.ls('-rw-r--r-- 1 u g 1234 Jan 1 a.txt').value[0].name==='a.txt');
ok('bad', !!C.convert('xyz','').error);
console.log((fail?'FAIL':'PASS')+' JcForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);