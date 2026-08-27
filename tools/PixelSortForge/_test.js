
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function maxDiff(a,b){ var m=0; for(var i=0;i<a.length;i++){ var d=Math.abs(a[i]-b[i]); if(d>m)m=d; } return m; }
function eq(a,b){ return maxDiff(a,b)===0; }
function mkRGBA(w,h,fn){ var d=new Uint8ClampedArray(w*h*4); for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4;var p=fn(x,y);d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;} return d; }
function lumPx(d,idx){ var p=idx*4; return 0.299*d[p]+0.587*d[p+1]+0.114*d[p+2]; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var w=20,h=20;
  var img=mkRGBA(w,h,function(x,y){return [ (x*7+y*3)%256, (x*5+y*11)%256, (y*9+x*2)%256 ];});
  var hi=A.pixelSortProcess(img,w,h,{thr:300,mode:0,maxLen:60});
  ok('pixsort thr300 identity', eq(hi,img));
  var ps=A.pixelSortProcess(img,w,h,{thr:40,mode:0,maxLen:60});
  ok('pixsort length', ps.length===img.length);
  ok('pixsort changed', !eq(ps,img));
  // pixelsort only reorders within a row -> per-row color multiset preserved (no new colors)
  function rowMultiset(d,yy){ var m={}; for(var xx=0;xx<w;xx++){ var i=(yy*w+xx)*4; var k=d[i]+','+d[i+1]+','+d[i+2]; m[k]=(m[k]||0)+1; } return m; }
  function sameMult(a,b){ var ka=Object.keys(a); if(ka.length!==Object.keys(b).length) return false; for(var kk in a){ if(b[kk]!==a[kk]) return false; } return true; }
  var preserved=true;
  for(var yy=0;yy<h;yy++){ if(!sameMult(rowMultiset(img,yy), rowMultiset(ps,yy))) preserved=false; }
  ok('pixsort row multiset preserved', preserved);
  console.log(T.join('\n'));
  console.log('PIXSORT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
