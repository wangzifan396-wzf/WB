
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.generate({name:'Alex',role:'designer',interests:'UX',tone:'pro'});
ok('len', g.length>=1 && g[0].indexOf('Alex')>=0 && g[0].indexOf('designer')>=0);
ok('empty', A.generate({name:'',role:'',interests:''}).length>=1);
ok('casual', A.generate({name:'B',role:'x',interests:'y',tone:'casual'})[0].indexOf('B')>=0);
console.log('BioForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
