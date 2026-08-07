
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var rnd=rngF();
function rngF(){ var s=12345; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
var p=A.generate(16,{rng:rnd});
ok('length 16', p.length===16);
ok('entropy 16*log2(94)', Math.abs(A.entropyBits(16,94)-104.87)<0.2);
ok('strength strong', A.strength(16,94)==='强');
var cs=A.buildCharset({symbol:true}); ok('charset 94', cs.length===94);
var noSym=A.buildCharset({symbol:false}); ok('no-symbol 62', noSym.length===62);
ok('exclude works', A.buildCharset({symbol:true,exclude:'l1'}).indexOf('l')<0);
console.log('PasswordGeneratorForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
