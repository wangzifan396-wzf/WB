
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('two urls', A.extract('go https://a.com x http://b.org/p?q=1').length===2);
ok('has https', A.extract('see https://a.com now')[0]==='https://a.com');
ok('email', A.extractEmails('mail me x@y.com thanks')[0]==='x@y.com');
console.log('ExtractLinksForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
