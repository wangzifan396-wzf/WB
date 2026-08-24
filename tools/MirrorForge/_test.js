
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function mkRGBA(w,h,fn){ var d=new Uint8ClampedArray(w*h*4); for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4;var p=fn(x,y);d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;} return d; }
function px(d,w,x,y,c){ return d[(y*w+x)*4+c]; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var w=4,h=4;
  var img=mkRGBA(w,h,function(x,y){return [x*60, y*60, (x*4+y)*10];});
  var mh=A.mirrorProcess(img,w,h,{mode:'h'});
  var okH=true;
  for(var y=0;y<h;y++)for(var x=0;x<w;x++)for(var c=0;c<4;c++){
    if(px(mh,w,x,y,c)!==px(img,w,w-1-x,y,c)) okH=false;
  }
  ok('mirror h exact', okH);
  var mv=A.mirrorProcess(img,w,h,{mode:'v'});
  var okV=true;
  for(var y2=0;y2<h;y2++)for(var x2=0;x2<w;x2++)for(var c2=0;c2<4;c2++){
    if(px(mv,w,x2,y2,c2)!==px(img,w,x2,h-1-y2,c2)) okV=false;
  }
  ok('mirror v exact', okV);
  var mb=A.mirrorProcess(img,w,h,{mode:'both'});
  ok('mirror both length', mb.length===img.length);
  ok('mirror both corner', px(mb,w,0,0,0)===px(img,w,w-1,h-1,0));
  console.log(T.join('\n'));
  console.log('MIRROR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
