
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var c=A.cover({name:'张三',role:'前端工程师',company:'Acme',experience:'五年 Web 开发'});
ok('len', c.length>=2);
ok('name', c.join('').indexOf('张三')>=0);
ok('role', c.join('').indexOf('前端工程师')>=0);
ok('enth', A.cover({name:'李',role:'x',company:'y',experience:'z',tone:'enthusiastic'}).length>=2);
console.log('CoverForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
