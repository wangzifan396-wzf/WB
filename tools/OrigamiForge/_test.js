
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
  var w=36,h=36;
  var img=mkRGBA(w,h,function(x,y){return [x*7, y*7, (x+y)*3];});
  var o=A.origamiProcess(img,w,h,{cell:18});
  ok('origami length', o.length===img.length);
  ok('origami changed', !eq(o,img));
  var set={}; for(var i=0;i<o.length;i+=4){ set[o[i]+','+o[i+1]+','+o[i+2]]=1; }
  ok('origami few colors', Object.keys(set).length < w*h);
  // crease: diagonal pixel brighter than cell interior
  var gx=0,gy=0,cw=18,ch=18;
  var dpx=(gy+cw/2)*w+(gx+cw/2); // on diagonal
  var ip=(gy+ch/2)*w+(gx+2); // interior triangle A
  ok('origami crease brighter', (o[dpx*4]+o[dpx*4+1]+o[dpx*4+2]) > (o[ip*4]+o[ip*4+1]+o[ip*4+2]));
  console.log(T.join('\n'));
  console.log('ORIGAMI_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
