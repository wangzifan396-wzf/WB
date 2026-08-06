
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('enc/dec ascii', A.zwDecode(A.zwEncode('Hello'))==='Hello');
ok('enc/dec unicode', A.zwDecode(A.zwEncode('你好世界'))==='你好世界');
ok('hide/reveal', A.zwReveal(A.zwHide('carrier text', 'secret'))==='secret');
ok('invisible', A.zwEncode('x').replace(/[^\u200B\u200C\u200D\uFEFF\u2060]/g,'').length===A.zwEncode('x').length);
console.log('ZerowidthForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
