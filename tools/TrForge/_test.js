const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('up', C.run('abc','a-z','A-Z',false,false).value==='ABC');
ok('del', C.run('a1b2c3','0-9','',true,false).value==='abc');
ok('sq', C.run('aaabbb','', '',false,true).value==='ab');
ok('expand', C.expand('a-c').length===3);
console.log((fail?'FAIL':'PASS')+' TrForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);