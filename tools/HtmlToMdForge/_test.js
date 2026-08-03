const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('h1', C.toMd('<h1>Title</h1>').value==='# Title');
ok('strong', C.toMd('<strong>bold</strong>').value==='**bold**');
ok('link', C.toMd('<a href="http://x">link</a>').value==='[link](http://x)');
ok('ul', C.toMd('<ul><li>a</li><li>b</li></ul>').value==='- a\n- b');
ok('ol', C.toMd('<ol><li>a</li><li>b</li></ol>').value==='1. a\n2. b');
ok('strip', C.toMd('<p>hi <span>x</span></p>').value==='hi x');
console.log((fail?'FAIL':'PASS')+' HtmlToMdForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);