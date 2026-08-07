
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=[0.1,0.2,0.3,0.4,0.5];
ok('ksStat range', (function(){var D=A.ksStatistic(function(x){return x;},s);return D>=0&&D<=1;})());
ok('ksP in [0,1]', (function(){var p=A.ksPValue(0.2,20);return p>=0&&p<=1;})());
ok('empCdf point', A.empiricalCdf([1,2,3,4],2.5)===0.5);
console.log('KolmogorovSmirnovForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
