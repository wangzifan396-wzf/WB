
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var pol={minLen:12,maxLen:64,upper:1,lower:1,digit:1,special:1,noRepeat:1,noSeq:1,noCommon:1};
var s=A.checkPassword('Kp3#Qm9@Wx2v', pol);
ok('ok12', s.ok===true && s.length===12 && s.score>0);
var r2=A.checkPassword('aaaaaa', pol);
ok('short/repeat', r2.issues.length>0);
var r3=A.checkPassword('abcdefghijkl', pol);
ok('noUpper', r3.ok===false && r3.issues.indexOf('缺少大写字母')>=0);
var r4=A.checkPassword('Password123!', pol);
ok('common', r4.issues.indexOf('命中常见弱口令')>=0);
var g=A.genPassword(pol, rngFactory(7));
ok('genlen', g.length>=12);
ok('genok', A.checkPassword(g, pol).ok===true);
ok('seq', A.hasSequence('abc')===true && A.hasSequence('xqz')===false);
console.log('PasswordPolicyForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
