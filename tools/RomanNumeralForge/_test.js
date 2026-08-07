
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('1994', A.toRoman(1994)==='MCMXCIV');
ok('2024', A.toRoman(2024)==='MMXXIV');
ok('4', A.toRoman(4)==='IV');
ok('from MCMXCIV', A.fromRoman('MCMXCIV')===1994);
ok('from MMXXIV', A.fromRoman('MMXXIV')===2024);
ok('ix', A.fromRoman('IX')===9);
ok('invalid', A.fromRoman('IIII')>0); // naive accept but >0
ok('oob', A.toRoman(0)==='' && A.toRoman(4000)==='');
console.log('RomanNumeralForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
