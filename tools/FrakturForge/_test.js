
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('A codepoint', A.fraktur('A').codePointAt(0)===0x1D504);
ok('a codepoint', A.fraktur('a').codePointAt(0)===0x1D51E);
ok('C special', A.fraktur('C')==='ℭ');
ok('not ascii', A.fraktur('A')!=='A');
console.log('FrakturForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
