
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.gen({root:true, indent_style:'space', indent_size:'4', charset:'utf-8', end_of_line:'lf', final:true, trim:true, extra:'[*.py]\nindent_size = 4'}).value;
ok('root', r.indexOf('root = true')>=0);
ok('size', r.indexOf('indent_size = 4')>=0);
ok('trim', r.indexOf('trim_trailing_whitespace = true')>=0);
ok('extra', r.indexOf('[*.py]')>=0);
ok('nodef', C.gen({}).value.indexOf('root = false')>=0);
console.log((fail?'FAIL':'PASS')+' EditorconfigForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);