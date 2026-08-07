
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('zero', A.numToCN(0)==='零');
ok('12345', A.numToCN(12345)==='一万二千三百四十五');
ok('10 -> 十', A.numToCN(10)==='十');
ok('15 -> 十五', A.numToCN(15)==='十五');
ok('110 -> 一百一十', A.numToCN(110)==='一百一十');
ok('1e8 -> 一亿', A.numToCN(100000000)==='一亿');
ok('rmb 0', A.toRMB(0)==='零圆整');
ok('rmb 100', A.toRMB(100)==='壹佰圆整');
ok('rmb 123.45', A.toRMB(123.45)==='壹佰贰拾叁圆肆角伍分');
console.log('NumberToChineseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
