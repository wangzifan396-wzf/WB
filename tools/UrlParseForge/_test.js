
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.parse('https://user.example.com:8080/path/to?a=1&b=hello%20world#frag');
ok('protocol https', r.protocol==='https');
ok('host', r.host==='user.example.com');
ok('port 8080', r.port==='8080');
ok('path', r.pathname==='/path/to');
ok('param a', r.params.a==='1');
ok('param b decoded', r.params.b==='hello world');
ok('hash', r.hash==='frag');
var noq=A.parse('http://example.com/');
ok('no port empty', noq.port==='');
ok('no query empty', noq.query==='');
console.log('UrlParseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
