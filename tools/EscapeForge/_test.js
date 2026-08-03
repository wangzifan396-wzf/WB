const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('html', C.esc('<a>','html').value==='&lt;a&gt;');
ok('unhtml', C.unesc('&lt;a&gt;','html').value==='<a>');
ok('sql', C.esc("a'b",'sql').value==="a''b");
ok('unsql', C.unesc("a''b",'sql').value==="a'b");
ok('url', C.esc('a b','url').value==='a%20b');
ok('unurl', C.unesc('a%20b','url').value==='a b');
ok('js', C.esc('a"b','js').value==='a\\"b');
ok('unjs', C.unesc('a\\"b','js').value==='a"b');
console.log((fail?'FAIL':'PASS')+' EscapeForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);