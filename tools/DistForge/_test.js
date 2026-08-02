const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const near=(a,b)=>Math.abs(a-b)<1e-6;
// levenshtein
ok('lev kitten/sitting', A.dsLevenshtein('kitten','sitting')===3);
ok('lev empty', A.dsLevenshtein('','abc')===3 && A.dsLevenshtein('abc','')===3);
ok('lev same', A.dsLevenshtein('same','same')===0);
ok('lev transpose is 2', A.dsLevenshtein('ab','ba')===2);
// damerau OSA
ok('osa transpose is 1', A.dsDamerauOSA('ab','ba')===1);
ok('osa kitten', A.dsDamerauOSA('kitten','sitting')===3);
ok('osa ca/abc', A.dsDamerauOSA('ca','abc')===3);
// hamming
ok('hamming karolin', A.dsHamming('karolin','kathrin').value===3);
ok('hamming unequal error', A.dsHamming('ab','abc').error!==null);
ok('hamming zero', A.dsHamming('abc','abc').value===0);
// jaro / jaro-winkler
ok('jaro martha', near(A.dsJaro('MARTHA','MARHTA'), 17/18));
ok('jw martha', near(A.dsJaroWinkler('MARTHA','MARHTA'), 17/18 + 3*0.1*(1-17/18)));
ok('jaro dwayne', near(A.dsJaro('DWAYNE','DUANE'), (4/6+4/5+1)/3));
ok('jw dwayne', near(A.dsJaroWinkler('DWAYNE','DUANE'), 0.84));
ok('jaro identical', A.dsJaro('x','x')===1);
ok('jaro disjoint', A.dsJaro('abc','xyz')===0);
// dice
ok('dice night/nacht', near(A.dsDice('night','nacht'), 0.25));
ok('dice identical', A.dsDice('abab','abab')===1);
ok('dice short', A.dsDice('a','b')===0);
// aggregate
var all=A.dsAll('kitten','sitting');
ok('all pack', all.levenshtein===3 && all.hamming===null && all.dice>=0);
console.log('DistForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
