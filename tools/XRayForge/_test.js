
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
  var img=mkRGBA(w,h,function(x,y){return [x*16, y*10, (x+y)*4];});
  var xr=A.xrayProcess(img,w,h,{contrast:1.6,glow:0.5});
  ok('xray length', xr.length===img.length);
  ok('xray changed', !eq(xr,img));
  // inverted: bright input -> dark output
  var bright=A.xrayProcess(mkRGBA(w,h,function(){return [255,255,255];}),w,h,{contrast:1.6,glow:0.5});
  var dark=A.xrayProcess(mkRGBA(w,h,function(){return [0,0,0];}),w,h,{contrast:1.6,glow:0.5});
  ok('xray inverts', bright[0] < dark[0]);
  console.log(T.join('\n'));
  console.log('XRAY_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
