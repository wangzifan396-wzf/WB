
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var fullMajor=A.detectKey(['C','D','E','F','G','A','B']);
ok('full C major only major', fullMajor.major.length===1 && fullMajor.major[0]==='C major');
ok('full C major => A minor', fullMajor.minor.indexOf('A minor')>=0);
ok('C major scale notes', A.scale('C',A.MAJOR).join(' ')==='C D E F G A B');
ok('C chord in C major', A.detectKey(['C','E','G']).major.indexOf('C major')>=0);
ok('A minor scale notes', A.scale('A',A.MINOR).join(' ')==='A B C D E F G');
console.log('KeyFinderForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
