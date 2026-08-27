
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
  var t=A.thermalProcess(img,w,h,{levels:16});
  ok('thermal length', t.length===img.length);
  ok('thermal changed', !eq(t,img));
  // bright input pixel -> warm (r high, b low); dark input -> cool (b high)
  var bright=A.thermalProcess(mkRGBA(w,h,function(){return [255,255,255];}),w,h,{levels:16});
  var dark=A.thermalProcess(mkRGBA(w,h,function(){return [0,0,0];}),w,h,{levels:16});
  var bp=(0)*4, dp=(0)*4;
  ok('thermal bright warm', bright[bp] > bright[bp+2]);
  ok('thermal dark cool', dark[dp+2] >= dark[dp]);
  console.log(T.join('\n'));
  console.log('THERMAL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
