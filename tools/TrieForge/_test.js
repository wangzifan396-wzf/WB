const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var t=A.trieCreate();
A.trieInsert(t,'cat'); A.trieInsert(t,'car'); A.trieInsert(t,'dog'); A.trieInsert(t,'card');
ok('contains cat', A.trieContains(t,'cat')===true);
ok('contains ca false', A.trieContains(t,'ca')===false);
ok('startsWith ca', A.trieStartsWith(t,'ca')===true);
ok('startsWith cz false', A.trieStartsWith(t,'cz')===false);
var col=A.trieCollect(t,'ca').sort();
ok('collect ca', JSON.stringify(col)==='["car","card","cat"]' || JSON.stringify(col)==='["car","cat","card"]');
ok('collect empty', A.trieCollect(t,'zz').length===0);
ok('delete cat', A.trieDelete(t,'cat')===true);
ok('cat gone', A.trieContains(t,'cat')===false);
ok('ca still prefix', A.trieStartsWith(t,'ca')===true);
ok('delete missing false', A.trieDelete(t,'zzz')===false);
ok('reinsert works', (function(){A.trieInsert(t,'cat');return A.trieContains(t,'cat');})());
ok('empty trie contains false', A.trieContains(A.trieCreate(),'x')===false);
console.log('TrieForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
