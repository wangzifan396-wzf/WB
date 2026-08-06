
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('eq encodes', A.qpEncStr('=')==='=3D');
ok('roundtrip', A.qpDecStr(A.qpEncStr('Hello, world!'))==='Hello, world!');
ok('nonascii', A.qpDecStr(A.qpEncStr('café'))==='café');
console.log('QuotedPrintableForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
