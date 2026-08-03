const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('asc', C.toASCII('münchen')==='xn--mnchen-3ya');
ok('uni', C.toUnicode('xn--mnchen-3ya')==='münchen');
ok('asc2', C.toASCII('ü')==='xn--tda');
ok('uni2', C.toUnicode('xn--tda')==='ü');
ok('domain', C.toASCII('münchen.de')==='xn--mnchen-3ya.de');
ok('rt', C.toASCII(C.toUnicode('xn--mnchen-3ya'))==='xn--mnchen-3ya');
console.log((fail?'FAIL':'PASS')+' PunycodeForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);