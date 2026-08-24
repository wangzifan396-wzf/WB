
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
  var img=mkRGBA(w,h,function(x,y){return [x*32, y*32, (x+y)*16];});
  var ident=A.perspectiveProcess(img,w,h,{});
  ok('persp identity low diff', maxDiff(ident,img)<=2);
  var flip=A.perspectiveProcess(img,w,h,{corners:[{x:7,y:0},{x:0,y:0},{x:0,y:7},{x:7,y:7}]});
  ok('persp flip length', flip.length===img.length);
  var si=(0*8+7)*4;
  ok('persp flip corner', flip[0]===img[si]&&flip[1]===img[si+1]&&flip[2]===img[si+2]&&flip[3]===img[si+3]);
  var out2=A.perspectiveProcess(img,w,h,{corners:[{x:20,y:20},{x:30,y:20},{x:30,y:30},{x:20,y:30}]});
  ok('persp outside alpha 0', out2[3]===0);
  // 单应求解数值一致性：identity 角点应使 H≈缩放矩阵
  var H=A.solveHomography([{u:0,v:0},{u:1,v:0},{u:1,v:1},{u:0,v:1}],[{x:0,y:0},{x:7,y:0},{x:7,y:7},{x:0,y:7}]);
  ok('persp H finite', isFinite(H.a)&&isFinite(H.g)&&isFinite(H.h_));
  console.log(T.join('\n'));
  console.log('PERSPECTIVE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
