const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('upper', C.fmt('select 1').value.indexOf('SELECT')>=0);
ok('break', C.fmt('select a from t where x=1').value.split('\n').length>=3);
ok('string', C.fmt("select 'a b' from t").value.indexOf("'a b'")>=0);
ok('kw', C.fmt('select a from t').value.indexOf('FROM')>=0);
ok('comment', C.fmt('select a -- note\nfrom t').value.indexOf('-- note')>=0);
console.log((fail?'FAIL':'PASS')+' SqlFmtForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);