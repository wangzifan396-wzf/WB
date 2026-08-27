
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
  var q=A.quiltProcess(img,w,h,{cell:10});
  ok('quilt length', q.length===img.length);
  ok('quilt changed', !eq(q,img));
  var set={}; for(var i=0;i<q.length;i+=4){ set[q[i]+','+q[i+1]+','+q[i+2]]=1; }
  ok('quilt few colors', Object.keys(set).length < w*h);
  // corner(0,0) is a seam (0.55x); interior pixel of same patch is tinted (1.08x) -> seam darker
  var corner=q[0]+q[1]+q[2];
  var ip=(5*w+5)*4; var interior=q[ip]+q[ip+1]+q[ip+2];
  ok('quilt seam darker than interior', corner < interior);
  console.log(T.join('\n'));
  console.log('QUILT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
