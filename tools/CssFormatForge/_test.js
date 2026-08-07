
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.format('a{b:1;c:2}');
ok('has open on newline', r.indexOf(' {\n')>=0);
ok('has declaration', r.indexOf('b:1')>=0);
ok('has closing', r.indexOf('}')>=0);
ok('multiline', r.split('\n').length>=3);
console.log('CssFormatForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
