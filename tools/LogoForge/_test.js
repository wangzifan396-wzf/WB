
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var svg=A.buildLogo('Hi',{});
ok('svg', svg.indexOf('<svg')===0 && svg.indexOf('Hi')>0);
ok('esc', A.esc('<')==='&lt;' && A.esc('&')==='&amp;');
var svg2=A.buildLogo('X',{bg:'#000',fg:'#fff',size:40,weight:400});
ok('opts', svg2.indexOf('#000')>0 && svg2.indexOf('font-weight="400"')>0);
console.log('LogoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
