
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('basic', A.minify('a { color: red; }')==='a{color:red}');
ok('comment removed', A.minify('/* c */ b{x:1}')==='b{x:1}');
ok('trailing semi', A.minify('p{margin:0;}')==='p{margin:0}');
ok('selector space', A.minify('div  >  p { color:blue }')==='div>p{color:blue}');
console.log('CssForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
