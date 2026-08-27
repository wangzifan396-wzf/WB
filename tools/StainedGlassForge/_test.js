
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function maxDiff(a,b){ var m=0; for(var i=0;i<a.length;i++){ var d=Math.abs(a[i]-b[i]); if(d>m)m=d; } return m; }
function eq(a,b){ return maxDiff(a,b)===0; }
function leadCount(d){ var n=0; for(var i=0;i<d.length;i+=4){ if(d[i]<20&&d[i+1]<20&&d[i+2]<20) n++; } return n; }
function mkRGBA(w,h,fn){ var d=new Uint8ClampedArray(w*h*4); for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4;var p=fn(x,y);d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;} return d; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var w=40,h=40;
  var img=mkRGBA(w,h,function(x,y){return [x*6, y*6, (x+y)*3];});
  var s=A.stainedProcess(img,w,h,{cell:20,lead:3});
  ok('stained length', s.length===img.length);
  ok('stained changed', !eq(s,img));
  ok('stained has lead', leadCount(s) > 0);
  // cells are vivid: some pixel has a high max channel
  var vivid=false; for(var i=0;i<s.length;i+=4){ if(Math.max(s[i],s[i+1],s[i+2])>150) vivid=true; }
  ok('stained vivid cells', vivid);
  console.log(T.join('\n'));
  console.log('STAINED_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
