
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('basic',A.jsonToCsv([{a:1,b:2},{a:3,b:4}])==='a,b\n1,2\n3,4');
ok('quote',A.jsonToCsv([{x:'a,b'},{x:'c"d'}])==='x\n"a,b"\n"c""d"');
ok('single',A.jsonToCsv({p:1,q:2})==='p,q\n1,2');
ok('obj',A.jsonToCsv([{a:{k:1}}]).indexOf('"{')>=0);
console.log('JsonToCsvForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
