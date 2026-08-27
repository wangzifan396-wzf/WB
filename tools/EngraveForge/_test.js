
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function maxDiff(a,b){ var m=0; for(var i=0;i<a.length;i++){ var d=Math.abs(a[i]-b[i]); if(d>m)m=d; } return m; }
function eq(a,b){ return maxDiff(a,b)===0; }
function inkCount(d){ var n=0; for(var i=0;i<d.length;i+=4){ if(d[i]<20) n++; } return n; }
function mkRGBA(w,h,fn){ var d=new Uint8ClampedArray(w*h*4); for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4;var p=fn(x,y);d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;} return d; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var w=16,h=16;
  var img=mkRGBA(w,h,function(x,y){return [x*16, y*16, (x+y)*8];});
  var e=A.engraveProcess(img,w,h,{density:6,angle:45});
  ok('engrave length', e.length===img.length);
  ok('engrave changed', !eq(e,img));
  var gray=true; for(var i=0;i<e.length;i+=4){ if(e[i]!==e[i+1]||e[i+1]!==e[i+2]) gray=false; }
  ok('engrave grayscale', gray);
  var dark=mkRGBA(w,h,function(){return [10,10,10];});
  var light=mkRGBA(w,h,function(){return [245,245,245];});
  ok('engrave dark more ink', inkCount(A.engraveProcess(dark,w,h,{density:6,angle:45})) > inkCount(A.engraveProcess(light,w,h,{density:6,angle:45})));
  console.log(T.join('\n'));
  console.log('ENGRAVE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
