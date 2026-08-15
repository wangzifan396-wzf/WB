
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('count1',A.count('192.168.1.1','192.168.1.10')===10);
ok('count2',A.count('10.0.0.0','10.0.0.255')===256);
ok('countErr',A.count('10.0.0.5','10.0.0.1')===null);
var l=A.list('192.168.1.1','192.168.1.3',100);
ok('list',l.items.length===3 && l.items[0]==='192.168.1.1');
var big=A.list('10.0.0.0','10.0.0.255',10);
ok('listTrunc',big.truncated===true && big.total===256);
ok('range',A.rangeInfo('1.1.1.1','1.1.1.5').count===5);
console.log('IpRangeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
