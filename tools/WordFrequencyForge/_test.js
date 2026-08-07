
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.freq('the cat and the dog and a cat the', 3, true);
function find(arr,k){ for(var i=0;i<arr.length;i++) if(arr[i][0]===k) return arr[i][1]; return -1; }
ok('cat count 2', find(r,'cat')===2);
ok('sorted desc', r[0][1]>=r[r.length-1][1]);
var r2=A.freq('苹果 苹果 香蕉', 2, false);
ok('chinese token', find(r2,'苹果')===2);
ok('total entries', r2.length===2);
console.log('WordFrequencyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
