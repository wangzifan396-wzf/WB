
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var svg = A.buildOgSVG({title:"Hi", subtitle:"sub", brand:"me", bg:"#000", fg:"#fff"});
ok('title', svg.indexOf(">Hi</text>") >= 0);
ok('sub', svg.indexOf(">sub</text>") >= 0);
ok('brand', svg.indexOf(">me</text>") >= 0);
ok('bg', svg.indexOf('fill="#000"') >= 0);
ok('escape', A.buildOgSVG({title:"<x>"}).indexOf("&lt;x&gt;") >= 0);
console.log('OgImageForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
