
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function maxDiff(a,b){ var m=0; for(var i=0;i<a.length;i++){ var d=Math.abs(a[i]-b[i]); if(d>m)m=d; } return m; }
function eq(a,b){ return maxDiff(a,b)===0; }
function mkRGBA(w,h,fn){ var d=new Uint8ClampedArray(w*h*4); for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=(y*w+x)*4;var p=fn(x,y);d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255;} return d; }
function isBinary(d){ for(var i=0;i<d.length;i+=4){ if(!((d[i]===255&&d[i+1]===255&&d[i+2]===255)||(d[i]===0&&d[i+1]===0&&d[i+2]===0))) return false; } return true; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var w=24,h=24;
  var white=mkRGBA(w,h,function(){return [255,255,255];});
  var cw=A.comicProcess(white,w,h,{cell:8,edge:28});
  ok('comic allwhite identity', eq(cw,white));
  var img=mkRGBA(w,h,function(x,y){return [x*10, y*10, (x+y)*5];});
  var c2=A.comicProcess(img,w,h,{cell:8,edge:28});
  ok('comic length', c2.length===img.length);
  ok('comic changed', !eq(c2,img));
  ok('comic binary output', isBinary(c2));
  console.log(T.join('\n'));
  console.log('COMIC_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
