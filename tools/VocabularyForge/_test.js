
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var q={w:'apple',m:'苹果'};
ok('zh',A.check(q,'苹果')===true);
ok('en',A.check(q,'Apple')===true);
ok('wrong',A.check(q,'香蕉')===false);
ok('empty',A.check(q,'')===false);
ok('pick',A.WORDS.indexOf(A.pick(function(){return 0;}))===0);
console.log('VocabularyForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
