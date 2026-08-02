const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('single match', JSON.stringify(A.ahoFind('he', A.ahoBuild(['he'])))==='[{"pattern":"he","index":0}]');
ok('single in she', (function(){ var h=A.ahoFind('she', A.ahoBuild(['he'])); return h.length===1 && h[0].index===1; })());
ok('he+she in she', (function(){ var h=A.ahoFind('she', A.ahoBuild(['he','she'])); var pats=h.map(function(x){return x.pattern;}); return pats.indexOf('she')>=0 && pats.indexOf('he')>=0 && h.length===2; })());
ok('overlap aa', (function(){ var h=A.ahoFind('aaa', A.ahoBuild(['aa'])); return h.length===2 && h[0].index===0 && h[1].index===1; })());
ok('abc positions', (function(){ var h=A.ahoFind('xabcx', A.ahoBuild(['abc'])); return h.length===1 && h[0].index===1; })());
ok('ab+bc in abc', (function(){ var h=A.ahoFind('abc', A.ahoBuild(['ab','bc'])); return h.length===2; })());
ok('no match empty res', A.ahoFind('xyz', A.ahoBuild(['he'])).length===0);
ok('empty text', A.ahoFind('', A.ahoBuild(['he'])).length===0);
ok('empty patterns', A.ahoFind('x', A.ahoBuild([])).length===0);
ok('duplicate patterns', (function(){ var h=A.ahoFind('ab', A.ahoBuild(['ab','ab'])); return h.length===2 && h[0].index===0 && h[1].index===0; })());
ok('a+ab in ab', (function(){ var h=A.ahoFind('ab', A.ahoBuild(['a','ab'])); return h.length===2; })());
ok('she in ushers', (function(){ var h=A.ahoFind('ushers', A.ahoBuild(['she'])); return h.length===1 && h[0].index===1; })());
ok('he in ushers', (function(){ var h=A.ahoFind('ushers', A.ahoBuild(['he'])); return h.length===1 && h[0].index===2; })());
console.log('AhoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
