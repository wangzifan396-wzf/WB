
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('valid1',A.validate('00:1b:44:11:22:33')===true);
ok('valid2',A.validate('001b44112233')===true);
ok('invalid1',A.validate('gg:gg:gg:gg:gg:gg')===false);
ok('invalid2',A.validate('00:1b:44:11:22')===false);
var g=A.normMac('00-1b-44-11-22-33');
ok('norm',g.join('')==='001b44112233');
ok('fmt',A.format(g,'-')==='00-1b-44-11-22-33');
var a=A.generate(rngFactory(7),null);var b=A.generate(rngFactory(7),null);
ok('genDet',a===b);
ok('genValid',A.validate(a)===true);
ok('gen6',a.split(':').length===6);
console.log('MacGeneratorForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
