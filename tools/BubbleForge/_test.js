
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('fullwidth', A.styleText("abc","fullwidth") === "ａｂｃ");
ok('circle lower', A.styleText("abc","circle") === "ⓐⓑⓒ");
ok('circle digit', A.styleText("1","circle") === "①");
ok('bubble upper', A.styleText("ABC","bubble") === String.fromCharCode(0x1F170)+String.fromCharCode(0x1F171)+String.fromCharCode(0x1F172));
ok('space fullwidth', A.styleText("a b","fullwidth") === "ａ　ｂ");
ok('unknown style', A.styleText("abc","xxx") === "abc");
console.log('BubbleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
