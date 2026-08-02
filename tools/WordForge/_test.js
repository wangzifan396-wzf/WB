const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var s=A.analyze('Hello world.\n你好世界。');
ok('chars positive', s.chars>0);
ok('latin words', s.latin===2);
ok('cjk chars', s.cjk===4);
ok('lines', s.lines===2);
ok('sentences', s.sentences>=1);
ok('readingMin positive', s.readingMin>0);
var tw=A.topWords('the cat and the dog the',3);
ok('topWords freq', tw[0][0]==='the' && tw[0][1]===3);
ok('topWords count', tw.length===3);
console.log('WordForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
