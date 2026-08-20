
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildLocalSpec({model:'Llama-3-8B',params:'8',quant:'Q4_K_M',context:'8192',vram:'16'});
ok('weights', Math.abs(a.weightsGB-4.0)<0.001 && a.fit===true && a.totalGB>5 && a.totalGB<7);
ok('full', a.markdown.indexOf('Llama-3-8B')>=0 && a.markdown.indexOf('可部署')>=0 && a.markdown.indexOf('llama.cpp')>=0 && a.markdown.indexOf('KV Cache')>=0);
var b=A.buildLocalSpec({model:'Big',params:'70',quant:'Q8_0',context:'32768',vram:'16'});
ok('nofit', b.fit===false && b.markdown.indexOf('显存不足')>=0 && b.recommendation.indexOf('Q2_K')>=0);
var c=A.buildLocalSpec({});
ok('empty', c.weightsGB>0 && c.markdown.indexOf('（待填写模型）')>=0);
console.log('LocalModelSpecForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
