
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.apa({authors:['Smith, J.'],year:2020,title:'A Book',type:'book',publisher:'Acme'});
ok('book format', b==='Smith, J. (2020). A Book. Acme.');
var art=A.apa({authors:['Doe, A.'],year:2019,title:'X',type:'article',journal:'Nature'});
ok('article format', art==='Doe, A. (2019). X. Nature.');
console.log('BibliographyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
