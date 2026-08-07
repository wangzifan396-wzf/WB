
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('valid object', A.validate('{"a":1,"b":[1,2],"c":"x"}').valid===true);
ok('invalid trailing', A.validate('{"a":1} extra').valid===false);
ok('invalid unclosed', A.validate('{"a":1').valid===false);
ok('invalid missing colon', A.validate('{"a" 1}').valid===false);
ok('reports position', A.validate('{"a":1} x').position===8);
ok('valid nested', A.validate('[1,{"x":[true,null]}]').valid===true);
console.log('JsonValidatorForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
