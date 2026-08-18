
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.stripEmoji('hello 👋 world 🌍');
ok('count', r.count===2);
ok('clean', r.text.indexOf('👋')<0 && r.text.indexOf('🌍')<0);
ok('keep', r.text.indexOf('hello')>=0);
ok('zh', A.stripEmoji('你好😀吗').text.indexOf('你好')>=0);
console.log('EmojiStripForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
