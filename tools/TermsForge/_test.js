
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.buildDoc({kind:'隐私政策', entity:'甲公司'});
ok('privacy', p.kind==='隐私政策' && p.markdown.indexOf('甲公司')>=0 && p.markdown.indexOf('我们收集的信息')>=0);
var t=A.buildDoc({kind:'服务条款', entity:'乙'});
ok('terms', t.markdown.indexOf('服务说明')>=0 && t.markdown.indexOf('乙')>=0);
var c=A.buildDoc({kind:'行为准则', entity:'丙'});
ok('conduct', c.markdown.indexOf('基本准则')>=0);
ok('default', A.buildDoc({}).entity==='示例公司');
console.log('TermsForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
