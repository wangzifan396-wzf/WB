
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
  var w=32,h=32;
  var img=mkRGBA(w,h,function(x,y){return [(x*8)%256, (y*8)%256, ((x+y)*4)%256];});
  var htt=A.halftoneProcess(img,w,h,{spacing:8});
  ok('halftone length', htt.length===img.length);
  var binary=true, changed=false;
  for(var i=0;i<htt.length;i+=4){
    var r=htt[i],g=htt[i+1],b=htt[i+2];
    if(!((r===0&&g===0&&b===0)||(r===255&&g===255&&b===255))) binary=false;
    if(r!==img[i]||g!==img[i+1]||b!==img[i+2]) changed=true;
  }
  ok('halftone binary', binary);
  ok('halftone changed', changed);
  console.log(T.join('\n'));
  console.log('HALFTONE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
