const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('z', C.toUpper('0').value==='零元整');
ok('h', C.toUpper('100').value==='壹佰元整');
ok('f', C.toUpper('1234.56').value==='壹仟贰佰叁拾肆元伍角陆分');
ok('m', C.toUpper('1000000').value==='壹佰万元整');
ok('l', C.toUpper('105').value==='壹佰零伍元整');
ok('y', C.toUpper('100000001').value==='壹亿零壹元整');
ok('neg', C.toUpper('-12.34').value==='负壹拾贰元叁角肆分');
ok('bad', !!C.toUpper('x').error);
console.log((fail?'FAIL':'PASS')+' CnyForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);