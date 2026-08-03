const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('t0', C.fromUnix(0).value==='1970-01-01T00:00:00.000Z');
ok('tms', C.fromUnix(1000,true).value==='1970-01-01T00:00:01.000Z');
ok('d0', C.toUnix('1970-01-01T00:00:00Z').value==='0');
ok('dms', C.toUnix('1970-01-01T00:00:00.000Z',true).value==='0');
ok('round', (function(){var s=Math.floor(Date.now()/1000);return C.toUnix(C.fromUnix(s).value).value===String(s);})());
ok('bad', !!C.fromUnix('x').error);
console.log((fail?'FAIL':'PASS')+' EpochForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);