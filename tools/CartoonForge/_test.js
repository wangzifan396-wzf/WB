
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function maxDiff(a,b){ var m=0; for(var i=0;i<a.length;i++){ var d=Math.abs(a[i]-b[i]); if(d>m)m=d; } return m; }
function eq(a,b){ return maxDiff(a,b)===0; }
function mkRGBA(w,h,fn){ var d=new Uint8ClampedArray(w*h*4); for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4;var p=fn(x,y);d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;} return d; }
function countBlack(d){ var n=0; for(var i=0;i<d.length;i+=4){ if(d[i]===0&&d[i+1]===0&&d[i+2]===0) n++; } return n; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var w=16,h=16;
  var img=mkRGBA(w,h,function(x,y){return [x*16, y*16, (x+y)*8];});
  var c1=A.cartoonProcess(img,w,h,{levels:6,edge:24});
  ok('cartoon length', c1.length===img.length);
  ok('cartoon changed', !eq(c1,img));
  var eLow=countBlack(A.cartoonProcess(img,w,h,{levels:6,edge:24}));
  var eHigh=countBlack(A.cartoonProcess(img,w,h,{levels:6,edge:200}));
  ok('cartoon more edges at low thr', eLow>eHigh);
  // levels=2 -> quantize collapses R to 0 or 255
  var c2=A.cartoonProcess(img,w,h,{levels:2,edge:255});
  var rset={}; for(var i=0;i<c2.length;i+=4){ rset[c2[i]]=1; }
  ok('cartoon levels2 quantize', Object.keys(rset).length<=2);
  console.log(T.join('\n'));
  console.log('CARTOON_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
