
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
  var img=mkRGBA(w,h,function(x,y){return x<8?[0,0,0]:[255,255,255];});
  function avgSum(d){ var s=0; for(var i=0;i<d.length;i+=4) s+=d[i]+d[i+1]+d[i+2]; return s/(d.length/4); }
  var n0=A.neonProcess(img,w,h,{thr:40,glow:0,hue:180});
  ok('neon length', n0.length===img.length);
  ok('neon changed', !eq(n0,img));
  var dark=0; for(var i=0;i<n0.length;i+=4){ if((n0[i]+n0[i+1]+n0[i+2])<40) dark++; }
  ok('neon dark bg', dark > w*h*0.5);
  var bright=false; for(var i=0;i<n0.length;i+=4){ if(n0[i]>200||n0[i+1]>200||n0[i+2]>200) bright=true; }
  ok('neon has bright lines', bright);
  var n1=A.neonProcess(img,w,h,{thr:40,glow:6,hue:180});
  ok('neon glow spreads brightness', avgSum(n1) > avgSum(n0));
  console.log(T.join('\n'));
  console.log('NEON_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
