
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rect',A.rect(3,4).area===12&&A.rect(3,4).perimeter===14);
ok('square',A.square(5).area===25);
ok('circle',Math.abs(A.circle(1).area-Math.PI)<1e-9);
ok('tri',Math.abs(A.triangle(3,4,5).area-6)<1e-9&&A.triangle(3,4,5).perimeter===12);
ok('trap',A.trapezoid(3,5,4).area===16);
ok('ellipse',Math.abs(A.ellipse(2,3).area-6*Math.PI)<1e-9);
ok('poly',Math.abs(A.regularPolygon(4,2).area-4)<1e-9);
ok('calc',A.calc('circle',{r:1}).area>0);
console.log('ShapeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
