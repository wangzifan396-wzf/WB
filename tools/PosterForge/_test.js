
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var L=A.layout('T', 'S', 800, 1000);
ok('titleSize', L.titleSize===Math.round(800*0.085));
ok('subY>titleY', L.subY>L.titleY);
var svg=A.posterSVG('Hello','World','#000','#f00');
ok('svg title', svg.indexOf('>Hello<')>=0);
ok('svg sub', svg.indexOf('>World<')>=0);
ok('svg colors', svg.indexOf('#000')>=0 && svg.indexOf('#f00')>=0);
console.log('PosterForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
