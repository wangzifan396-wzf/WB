
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var c=A.circleOfFifths();
ok('circle length 12', c.length===12);
ok('circle[0] C 0# Am', c[0].major==='C' && c[0].sharps===0 && c[0].minor==='Am');
ok('circle[5] B 5# G#m', c[5].major==='B' && c[5].sharps===5 && c[5].minor==='G#m');
ok('keyInfo F -1 Dm', (function(){var r=A.keyInfo('F'); return r.sharps===-1 && r.minor==='Dm';})());
ok('keyInfo C# 7#', A.keyInfo('C#').sharps===7);
ok('accidentalOrder 3#', A.accidentalOrder(3).order.join('')==='FCG');
console.log('CircleOfFifthsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
