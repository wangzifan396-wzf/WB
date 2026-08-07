
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.pretty('{"a":1,"b":[1,2]}');
ok('pretty multiline', p.indexOf('\n')>=0);
var mn=A.minify('{\n "a":1\n}'); ok('minify no newline', mn.indexOf('\n')===-1 && mn==='{"a":1}');
ok('validate ok', A.validate('{"x":1}').valid===true);
ok('validate bad', A.validate('{bad}').valid===false);
ok('pretty roundtrip', A.pretty(A.minify('{"a":1}'))==='{\n  "a": 1\n}');
console.log('JsonFormatForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
