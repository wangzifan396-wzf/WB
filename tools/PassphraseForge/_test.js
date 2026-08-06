
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var words = ["alpha","bravo","charlie"];
ok('len', A.genPassphrase(words, 2, "-", function(){return 0;}) === "alpha-alpha");
ok('sep', A.genPassphrase(words, 2, ".", function(){return 0;}) === "alpha.alpha");
ok('index', A.genPassphrase(words, 3, "-", function(){return 0.99;}) === "charlie-charlie-charlie");
ok('entropy', Math.abs(A.entropyBits(words, 2) - 2*Math.log2(3)) < 1e-9);
ok('empty', A.genPassphrase([], 2, "-", function(){return 0;}) === "");
ok('wordlist', A.WORDLIST.split(" ").length > 100);
console.log('PassphraseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
