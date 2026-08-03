
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('fnv1a32 foobar', A.fnv1a32('foobar')==='bf9cf968');
ok('fnv1a64 foobar', A.fnv1a64('foobar')==='0x85944171f73967e8');
ok('fnv1_32 foobar', A.fnv1_32('foobar')==='31f0b262');
ok('fnv1_64 foobar', A.fnv1_64('foobar')==='0x340d8765a4dda9c2');
ok('fnv1a32 empty', A.fnv1a32('')==='811c9dc5');
ok('fnv1a32 deterministic', A.fnv1a32('hello')===A.fnv1a32('hello'));
ok('fnv1a vs fnv1 differ', A.fnv1a32('a')!==A.fnv1_32('a'));
console.log('FnvForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
