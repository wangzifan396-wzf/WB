
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('h1',A.md('# Hi').indexOf('<h1>Hi</h1>')>=0);
ok('bold',A.md('a **b** c').indexOf('<b>b</b>')>=0);
ok('list',A.md('- x\n- y').indexOf('<ul>')>=0 && (A.md('- x').match(/<li>/g)||[]).length===1);
ok('code',A.md('`z`').indexOf('<code>z</code>')>=0);
ok('escape',A.md('<x>').indexOf('&lt;x&gt;')>=0);
console.log('NotesForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
