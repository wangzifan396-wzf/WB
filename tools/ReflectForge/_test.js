
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
  var w=20,h=20;
  var img=mkRGBA(w,h,function(x,y){return [x*12, y*12, (x+y)*6];});
  var r=A.reflectProcess(img,w,h,{mode:0});
  ok('reflect length', r.length===img.length);
  ok('reflect changed', !eq(r,img));
  // horizontal symmetry: pixel(x) == pixel(w-1-x)
  var sym=true; for(var y=0;y<h;y++) for(var x=0;x<w;x++){ var a=(y*w+x)*4, b=(y*w+(w-1-x))*4; if(Math.abs(r[a]-r[b])>1||Math.abs(r[a+1]-r[b+1])>1||Math.abs(r[a+2]-r[b+2])>1) sym=false; }
  ok('reflect horizontal symmetric', sym);
  console.log(T.join('\n'));
  console.log('REFLECT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
