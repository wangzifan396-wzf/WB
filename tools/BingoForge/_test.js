
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var c=A.bingoCard(4); ok('5x5', c.length===5&&c[0].length===5);
ok('center free', c[2][2]===null);
ok('B col', c.every(function(row){return row[0]>=1&&row[0]<=15;}));
ok('O col', c.every(function(row){return row[4]>=61&&row[4]<=75;}));
var caller=A.bingoCaller(2); ok('caller 75', caller.length===75);
var marked=A.bingoMark(c, caller.slice(0,40)); ok('mark bool', marked[0][0]===true||marked[0][0]===false);
console.log('BingoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
