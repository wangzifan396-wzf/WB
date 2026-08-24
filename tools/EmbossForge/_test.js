
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function maxDiff(a,b){ var m=0; for(var i=0;i<a.length;i++){ var d=Math.abs(a[i]-b[i]); if(d>m)m=d; } return m; }
function eq(a,b){ return maxDiff(a,b)===0; }
function mkRGBA(w,h,fn){ var d=new Uint8ClampedArray(w*h*4); for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4;var p=fn(x,y);d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;} return d; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var w=12,h=12;
  var img=mkRGBA(w,h,function(x,y){return [x*20, y*20, (x+y)*10];});
  var flat=A.embossProcess(img,w,h,{strength:0});
  ok('emboss flat gray', eq(flat, grey(img,128)));
  ok('emboss length', A.embossProcess(img,w,h,{}).length===img.length);
  var e2=A.embossProcess(img,w,h,{azimuth:45,strength:1.5});
  var gray=true; for(var i=0;i<img.length;i+=4){ if(e2[i]!==e2[i+1]||e2[i+1]!==e2[i+2]) gray=false; }
  ok('emboss grayscale', gray);
  ok('emboss changed', !eq(e2,img));
  console.log(T.join('\n'));
  console.log('EMBOSS_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
  function grey(d,v){ var o=new Uint8ClampedArray(d.length); for(var i=0;i<d.length;i+=4){o[i]=v;o[i+1]=v;o[i+2]=v;o[i+3]=d[i+3];} return o; }
})();
