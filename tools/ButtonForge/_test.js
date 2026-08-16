
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var c=A.btnCss({bg:'#5E6AD2',color:'#fff',radius:8});
ok('bg', c.indexOf('background:#5E6AD2')>=0);
ok('radius', c.indexOf('border-radius:8px')>=0);
ok('hover', c.indexOf(':hover')>=0 && /:hover\{background:#[0-9a-f]{6};?\}/.test(c));
var c2=A.btnCss({bg:'#5E6AD2',hoverBg:'#444444',shadow:false});
ok('customhover', c2.indexOf('#444444')>=0 && c2.indexOf('box-shadow')<0);
console.log('ButtonForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
