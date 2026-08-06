
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var puz=A.shGen(6,3); ok('gen', !!puz);
if(puz){ var cover=[]; for(var i=0;i<36;i++) cover.push(0); var okc=true; puz.rects.forEach(function(r){ if(r.w*r.h!==r.area) okc=false; for(var y=r.y;y<r.y+r.h;y++) for(var x=r.x;x<r.x+r.w;x++){ if(x<0||y<0||x>=6||y>=6){okc=false;} else { if(cover[y*6+x]) okc=false; cover[y*6+x]++; } } }); ok('cover all once', okc && cover.every(function(v){return v===1;})); }
console.log('ShikakuForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
