
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var d=A.boxModel({});
  ok('box default contentW', d.contentW===200);
  ok('box default totalW', d.totalW===234);
  ok('box default totalH', d.totalH===134);
  var e=A.boxModel({width:200,height:100,padTop:10,padRight:10,padBottom:10,padLeft:10,borderTop:1,marginTop:0,marginRight:0,marginBottom:0,marginLeft:0});
  ok('box content-box totalW', e.totalW===222);
  var f=A.boxModel({width:200,height:100,padTop:10,padRight:10,padBottom:10,padLeft:10,borderTop:1,marginTop:0,marginRight:0,marginBottom:0,marginLeft:0,boxSizing:'border-box'});
  ok('box border-box contentW', f.contentW===178);
  ok('box border-box totalW', f.totalW===200);
  console.log(T.join('\n'));
  console.log('BOX_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
