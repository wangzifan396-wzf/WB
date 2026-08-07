
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('ABCDGH/AEDFHR =3', A.lcs("ABCDGH","AEDFHR")===3);
ok('AGGTAB/GXTXAYB =4', A.lcs("AGGTAB","GXTXAYB")===4);
ok('empty =0', A.lcs("","abc")===0);
ok('same =len', A.lcs("xyz","xyz")===3);
console.log('LcsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
