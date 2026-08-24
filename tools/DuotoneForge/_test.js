
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
  var w=8,h=8;
  var img=mkRGBA(w,h,function(x,y){return [255,0,0];});
  var d=A.duotoneProcess(img,w,h,{shadow:[0,0,0],highlight:[255,255,255]});
  // 纯红 lum=0.299 → 各通道相同（灰度），且等于 0.299*255≈76
  ok('duotone length', d.length===img.length);
  var gray=true; for(var i=0;i<d.length;i+=4){ if(Math.abs(d[i]-d[i+1])>1||Math.abs(d[i+1]-d[i+2])>1) gray=false; }
  ok('duotone grayscale map', gray);
  ok('duotone red->76', Math.abs(d[0]-76)<=1);
  var custom=A.duotoneProcess(img,w,h,{shadow:[10,20,30],highlight:[200,100,50]});
  ok('duotone custom range', custom[0]>=10&&custom[2]<=200);
  console.log(T.join('\n'));
  console.log('DUOTONE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
