const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('toBookmarklet prefix', A.toBookmarklet('alert(1)').indexOf('javascript:')===0);
ok('toBookmarklet encodes space', (function(){var u=A.toBookmarklet('a b'); return u.indexOf('a b')<0 && u.indexOf('javascript:')===0;})());
ok('roundtrip', A.fromBookmarklet(A.toBookmarklet('var x=1;'))==='var x=1;');
ok('validate ok', A.validateJs('var x=1;').ok===true);
ok('validate bad', A.validateJs('var x= =').ok===false);
ok('stripShebang', A.stripShebang('#!/usr/bin/env node\nconsole.log(1)')==='console.log(1)');
console.log('BookForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
