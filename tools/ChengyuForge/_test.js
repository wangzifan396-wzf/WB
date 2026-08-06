
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dataset', A.CHENGYU.length >= 50);
ok('search hanzi', A.search(A.CHENGYU, "一鸣").length === 1);
ok('search pinyin', A.search(A.CHENGYU, "rén").length >= 1);
ok('search meaning', A.search(A.CHENGYU, "努力").length >= 1);
ok('search empty', A.search(A.CHENGYU, "  ") === 0 || A.search(A.CHENGYU, "").length === 0);
var ch = A.chain(A.CHENGYU, "一鸣惊人");
ok('chain target', ch.some(function(x){ return x.w === "人山人海"; }));
ok('chain first char', ch.every(function(x){ return x.w.charAt(0) === "人"; }));
ok('firstChar', A.firstChar(A.CHENGYU, "一").length >= 1);
console.log('ChengyuForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
