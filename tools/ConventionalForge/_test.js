
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var r1=A.parseConventional('feat(api)!: add endpoint');
ok('conv type', r1.valid && r1.type==='feat');
ok('conv scope', r1.scope==='api');
ok('conv breaking', r1.breaking===true);
ok('conv desc', r1.description==='add endpoint');
var r2=A.parseConventional('fix: resolve crash');
ok('conv no scope', r2.scope===null && r2.breaking===false && r2.type==='fix');
var r3=A.parseConventional('not a commit');
ok('conv invalid', r3.valid===false);
var r4=A.parseConventional('chore(deps): bump version\n\nSome notes here');
ok('conv body', r4.body==='Some notes here');
console.log('ConventionalForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
