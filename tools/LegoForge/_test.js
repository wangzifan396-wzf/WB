
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
  var w=28,h=28;
  var img=mkRGBA(w,h,function(x,y){return [x*9, y*9, (x+y)*4];});
  var l=A.legoProcess(img,w,h,{cell:14});
  ok('lego length', l.length===img.length);
  ok('lego changed', !eq(l,img));
  // stud brighter than corner: brick(0,0) center (7,7) vs corner (0,0)
  var ci=(7*w+7)*4, co=0;
  ok('lego stud brighter', (l[ci]+l[ci+1]+l[ci+2]) > (l[co]+l[co+1]+l[co+2]));
  console.log(T.join('\n'));
  console.log('LEGO_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
