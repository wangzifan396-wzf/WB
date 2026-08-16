
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var items=A.parseItems("Netflix,15,m\nSpotify,120,y\niCloud,6,m");
ok('parse', items.length===3 && items[1].cycle==='yearly' && Math.abs(items[1].amount-120)<1e-9);
var t=A.totals(items);
ok('monthly', Math.abs(t.monthly-(15+10+6))<1e-9);
ok('yearly', Math.abs(t.yearly-((15+10+6)*12))<1e-9);
ok('count', t.count===3);
console.log('SubscriptionForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
