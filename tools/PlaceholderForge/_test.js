
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var svg = A.buildPlaceholderSVG(300, 200, "#999", "#fff", "Hi");
ok('has w', svg.indexOf('width="300"') >= 0);
ok('has h', svg.indexOf('height="200"') >= 0);
ok('has text', svg.indexOf(">Hi</text>") >= 0);
ok('has rect', svg.indexOf("<rect") >= 0);
ok('escape', A.buildPlaceholderSVG(10,10,"#000","#fff","<x>").indexOf("&lt;x&gt;") >= 0);
ok('default text', A.buildPlaceholderSVG(100,50,"#000","#fff").indexOf("100×50") >= 0);
console.log('PlaceholderForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
