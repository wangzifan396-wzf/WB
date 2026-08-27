
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
  var w=24,h=24, bands=4;
  var img=mkRGBA(w,h,function(x,y){return [x*10, y*10, (x+y)*5];});
  var c=A.celShadingProcess(img,w,h,{bands:bands});
  ok('cel length', c.length===img.length);
  ok('cel changed', !eq(c,img));
  // constant image: no edges -> posterize collapses to a single flat level (quantization works)
  var flat=A.celShadingProcess(mkRGBA(w,h,function(){return [120,120,120];}),w,h,{bands:bands});
  var set={}; for(var i=0;i<flat.length;i+=4){ set[Math.round(flat[i])]=1; }
  ok('cel quantize constant', Object.keys(set).length===1);
  console.log(T.join('\n'));
  console.log('CEL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
