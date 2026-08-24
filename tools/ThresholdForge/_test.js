
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
  var t2=A.thresholdProcess(img,w,h,{threshold:128,smooth:0});
  ok('threshold length', t2.length===img.length);
  ok('threshold changed', !eq(t2,img));
  var binary=true;
  for(var i=0;i<t2.length;i+=4){
    if(!(t2[i]===0&&t2[i+1]===0&&t2[i+2]===0) && !(t2[i]===255&&t2[i+1]===255&&t2[i+2]===255)) binary=false;
  }
  ok('threshold binary (smooth0)', binary);
  var inv=A.thresholdProcess(img,w,h,{threshold:128,smooth:0,invert:true});
  var flipped=true;
  for(var i2=0;i2<t2.length;i2+=4){ if(Math.abs(inv[i2]- (255-t2[i2]))>2) flipped=false; }
  ok('threshold invert', flipped);
  console.log(T.join('\n'));
  console.log('THRESHOLD_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
