const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('1984 -> MCMLXXXIV', A.toRoman(1984)==='MCMLXXXIV');
ok('2024 -> MMXXIV', A.toRoman(2024)==='MMXXIV');
ok('3999 -> MMMCMXCIX', A.toRoman(3999)==='MMMCMXCIX');
ok('4 -> IV', A.toRoman(4)==='IV');
ok('MCMLXXXIV -> 1984', A.fromRoman('MCMLXXXIV')===1984);
ok('MMXXIV -> 2024', A.fromRoman('MMXXIV')===2024);
ok('IX -> 9', A.fromRoman('IX')===9);
ok('roundtrip', A.toRoman(A.fromRoman('MCMXCIV'))==='MCMXCIV');
ok('canonical IV', A.isCanonical('IV')===true);
ok('non-canonical IIII', A.isCanonical('IIII')===false);
ok('range low throws', (function(){try{A.toRoman(0);return false;}catch(e){return true;}})());
ok('range high throws', (function(){try{A.toRoman(4000);return false;}catch(e){return true;}})());
ok('bad chars throws', (function(){try{A.fromRoman('ABC');return false;}catch(e){return true;}})());
console.log('RomanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
