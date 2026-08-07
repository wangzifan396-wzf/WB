
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var src='{"a":1,"b":[2,3],"c":{"d":4}}';
ok('pretty has newlines', A.pretty(src).indexOf('\n')>=0);
ok('minify no spaces', A.minify(src).indexOf(' ')===-1);
ok('roundtrip', A.minify(A.pretty(src))===A.minify(src));
ok('tryParse valid', A.tryParse(src)===true);
ok('tryParse invalid', A.tryParse('{bad')===false);
console.log('JsonFormatterForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
