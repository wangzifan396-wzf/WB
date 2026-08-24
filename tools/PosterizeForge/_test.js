
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
  var w=16,h=16;
  var img=mkRGBA(w,h,function(x,y){return [x*16, y*16, (x+y)*8];});
  var ident=A.posterizeProcess(img,w,h,{levels:256});
  ok('posterize 256 identity', eq(ident,img));
  var p2=A.posterizeProcess(img,w,h,{levels:4});
  ok('posterize length', p2.length===img.length);
  ok('posterize changed', !eq(p2,img));
  // levels=4 → step=85，每个通道值应是 0/85/170/255 之一
  var step=255/3, quant=true;
  for(var i=0;i<p2.length;i+=4){
    for(var c=0;c<3;c++){ var q=Math.round(p2[i+c]/step)*step; if(Math.abs(q-p2[i+c])>0.5) quant=false; }
  }
  ok('posterize quantized', quant);
  console.log(T.join('\n'));
  console.log('POSTERIZE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
