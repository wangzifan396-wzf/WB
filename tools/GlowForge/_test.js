
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var h=C.render('# Hi\n**b** and *i* and `c`\n- a\n- b\n[x](http://e.com)').value;
ok('h', h.indexOf('<h1>Hi</h1>')>=0);
ok('b', h.indexOf('<strong>b</strong>')>=0);
ok('i', h.indexOf('<em>i</em>')>=0);
ok('code', h.indexOf('<code>c</code>')>=0);
ok('ul', h.indexOf('<ul><li>a</li><li>b</li></ul>')>=0);
ok('link', h.indexOf('<a href="http://e.com"')>=0);
console.log((fail?'FAIL':'PASS')+' GlowForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);