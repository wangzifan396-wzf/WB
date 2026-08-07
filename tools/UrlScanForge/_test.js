
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var bad=A.scan('http://secure-login.example.com@evil.tk/verify');
ok('bad flagged high/with flags', bad.flags.length>=2);
ok('bad has @flag', bad.flags.some(function(f){return f.indexOf('@')>=0;}));
var good=A.scan('https://www.example.com/path?q=1');
ok('good low risk', good.risk==='低');
ok('good valid', good.valid===true);
ok('http flagged', A.scan('http://example.com').flags.length>=1);
console.log('UrlScanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
