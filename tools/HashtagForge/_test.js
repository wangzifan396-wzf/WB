
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('makeTag Hello World', A.makeTag('Hello World!')==='HelloWorld');
ok('makeTag travel', A.makeTag('travel @#$')==='travel');
var g=A.generate('travel',3); ok('generate len 3', g.length===3);
ok('generate all startWith #travel', g.every(function(x){return x.indexOf('#travel')===0;}));
ok('generate empty topic', A.generate('',3).length===0);
ok('generate default no junk', A.generate('food').every(function(x){return x[0]==='#';}));
console.log('HashtagForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
