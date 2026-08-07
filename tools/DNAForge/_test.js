
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('complement ATCG=TAGC', A.complement('ATCG')==='TAGC');
ok('reverseComplement ATCG=CGAT', A.reverseComplement('ATCG')==='CGAT');
ok('transcribe ATCG=AUCG', A.transcribe('ATCG')==='AUCG');
ok('gcContent ATCG=0.5', Math.abs(A.gcContent('ATCG')-0.5)<1e-9);
ok('isValidDNA true', A.isValidDNA('ATCG')===true);
ok('isValidDNA false', A.isValidDNA('ATXG')===false);
ok('reverseTranscribe AUCG=ATCG', A.reverseTranscribe('AUCG')==='ATCG');
console.log('DNAForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
