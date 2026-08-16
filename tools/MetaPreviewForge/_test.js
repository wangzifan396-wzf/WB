
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var h='<title>Hello</title><meta name="description" content="D"><meta property="og:title" content="OT"><meta property="og:image" content="i.png"><meta name="twitter:card" content="summary">';
var p=A.parseMeta(h);
ok('title',p.title==='Hello');
ok('desc',p.description==='D');
ok('og',p.og.title==='OT' && p.og.image==='i.png');
ok('tw',p.twitter.card==='summary');
var s=A.summarize(p); ok('sum',s.ogTitle==='OT');
console.log('MetaPreviewForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
