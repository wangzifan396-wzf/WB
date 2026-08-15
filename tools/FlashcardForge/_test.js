
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var cards=A.parseCards('a||1\nb||2\n\nc||3');
ok('count', cards.length===3);
ok('pair', cards[0].front==='a' && cards[0].back==='1');
ok('skip empty', cards[2].front==='c');
var sh=A.shuffle([1,2,3,4,5], rngFactory(42));
ok('shuffle len', sh.length===5);
ok('shuffle set', sh.slice().sort().join(',')==='1,2,3,4,5');
var sh2=A.shuffle([1,2,3,4,5], rngFactory(42));
ok('shuffle deterministic', sh.join(',')===sh2.join(','));
console.log('FlashcardForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
