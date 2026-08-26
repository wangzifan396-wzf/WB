
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r1=A.parseFtp('sftp://alice:secret@host.example.com:2222/path/to/file?x=1');
  ok('ftp valid', r1.valid===true);
  ok('ftp scheme', r1.scheme==='sftp');
  ok('ftp host', r1.host==='host.example.com');
  ok('ftp port', r1.port===2222);
  ok('ftp user', r1.user==='alice' && r1.password==='secret');
  ok('ftp path', r1.path==='/path/to/file');
  ok('ftp query', r1.query==='x=1');
  var r2=A.parseFtp('ftp://host');
  ok('ftp default port', r2.valid && r2.port===21 && r2.path==='/');
  ok('ftp bad scheme', A.parseFtp('http://h').valid===false);
  ok('ftp empty', A.parseFtp('').valid===false);
  console.log(T.join('\n'));
  console.log('FTP_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
