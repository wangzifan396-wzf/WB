
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r=A.parseUri('https://example.com/path?q=hello%20world#frag');
  ok('uri scheme', r.ok && r.scheme==='https');
  ok('uri host', r.host==='example.com');
  ok('uri path', r.path==='/path');
  ok('uri param decoded', r.params.q==='hello world');
  ok('uri frag', r.fragment==='frag');
  ok('uri bad', A.parseUri('not a uri').ok===false);
  ok('uri encode/decode', A.decodeUri(A.encodeUri('a b&c'))==='a b&c');
  console.log(T.join('\n'));
  console.log('URI_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
