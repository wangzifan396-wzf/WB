
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('zh', A.cotPrompt('2+2',3,'zeroshot','zh').prompt.indexOf('2+2')>=0);
ok('steps', (A.cotPrompt('x',5,'zeroshot','zh').prompt.match(/第 \d+ 步/g)||[]).length===5);
ok('fewshot', A.cotPrompt('x',3,'fewshot','zh').prompt.indexOf('示例')>=0);
ok('self', A.cotPrompt('x',3,'selfconsistency','zh').prompt.indexOf('一致')>=0);
ok('en', A.cotPrompt('x',2,'zeroshot','en').prompt.indexOf('Task:')>=0);
ok('err', !!A.cotPrompt('','3','zeroshot','zh').error);
console.log('ChainOfThoughtForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
