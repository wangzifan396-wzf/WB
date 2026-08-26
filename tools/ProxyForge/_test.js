
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r1=A.parseProxy('http://user:pass@proxy.example.com:8080');
  ok('proxy valid', r1.valid===true);
  ok('proxy scheme', r1.scheme==='http');
  ok('proxy host', r1.host==='proxy.example.com');
  ok('proxy port', r1.port===8080);
  ok('proxy auth', r1.username==='user' && r1.password==='pass' && r1.auth===true);
  var r2=A.parseProxy('socks5://127.0.0.1:1080');
  ok('socks5 valid', r2.valid && r2.scheme==='socks5' && r2.port===1080);
  ok('socks5 no auth', r2.auth===false);
  var r3=A.parseProxy('https://host');
  ok('https default port', r3.valid && r3.port===443);
  ok('proxy bad scheme', A.parseProxy('ftp://x').valid===false);
  ok('proxy no scheme', A.parseProxy('not a url').valid===false);
  ok('proxy bad port', A.parseProxy('http://h:99999').valid===false);
  console.log(T.join('\n'));
  console.log('PROXY_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
