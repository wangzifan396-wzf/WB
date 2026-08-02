const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('exact match', A.fuzzyMatch('abc','abc').matched);
ok('subsequence match', A.fuzzyMatch('fmt','format.ts').matched);
ok('no match', !A.fuzzyMatch('xyz','abc').matched);
ok('case insensitive', A.fuzzyMatch('BTN','button').matched);
ok('empty query matches all', A.fuzzyMatch('','anything').matched);
ok('positions correct', JSON.stringify(A.fuzzyMatch('ac','abc').positions)==='[0,2]');
var consec=A.fuzzyMatch('abc','abcdef').score, spread=A.fuzzyMatch('abc','axbxcx').score;
ok('consecutive scores higher', consec>spread);
var boundary=A.fuzzyMatch('b','x/button').score, mid=A.fuzzyMatch('b','xxbutton').score;
ok('boundary bonus', boundary>mid);
ok('start bonus', A.fuzzyMatch('a','abc').score > A.fuzzyMatch('a','xxa').score);
var f=A.fuzzyFilter('scb',['src/components/Button.tsx','package.json','src/b.ts']);
ok('filter drops nonmatch', f.every(function(x){ return x.item!=='package.json'; }));
ok('filter sorted desc', f.length>=2 && f[0].score>=f[1].score);
ok('filter keeps positions', Array.isArray(f[0].positions) && f[0].positions.length===3);
console.log('FuzzyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
