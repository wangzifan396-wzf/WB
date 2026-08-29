
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.extractUrls('see https://a.com/x and http://b.org');
  ok('url count', a.count===2);
  ok('url first', a.urls[0]==='https://a.com/x');
  ok('url trailing punct', A.extractUrls('visit https://a.com.').urls[0]==='https://a.com');
  ok('url unique', A.extractUrls('https://a.com https://a.com',{unique:true}).count===1);
  ok('url strip query', A.extractUrls('https://a.com/p?q=1',{stripQuery:true}).urls[0]==='https://a.com/p');
  ok('url none', A.extractUrls('no links here').count===0);
  console.log(T.join('\n'));
  console.log('URLEX_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
