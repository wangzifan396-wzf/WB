
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('has', A.sloganGenerate('星河','科技').slogans.length>0);
ok('name', A.sloganGenerate('星河','科技').slogans[0].indexOf('星河')>=0);
ok('kw', A.sloganGenerate('星河','科技').keyword==='科技');
ok('err', !!A.sloganGenerate('').error);
console.log('SloganForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
