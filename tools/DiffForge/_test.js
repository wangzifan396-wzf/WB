const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const a='line1\nline2\nline3', b='line1\nLINE2\nline3\nline4';
const d=A.diffLines(a,b);
ok('diffLines count', d.length===5);
ok('diffLines eq first', d[0].type==='eq' && d[0].a==='line1');
ok('diffLines del', d.some(function(x){return x.type==='del'&&x.a==='line2';}));
ok('diffLines add', d.some(function(x){return x.type==='add'&&x.b==='line4';}));
const s=A.diffStats(d);
ok('stats add', s.add===2);
ok('stats del', s.del===1);
ok('stats eq', s.eq===2);
const u=A.unifiedText(d,'a','b');
ok('unified header', u.indexOf('--- a')===0 && u.indexOf('+++ b')>0);
ok('unified plus', u.indexOf('\n+LINE2')>0);
const id=A.inlineDiff('abc','axc');
ok('inline eq count', id.filter(function(x){return x.type==='eq';}).length===2);
ok('inline del', id.some(function(x){return x.type==='del'&&x.t==='b';}));
ok('inline add', id.some(function(x){return x.type==='add'&&x.t==='x';}));
console.log('DiffForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
