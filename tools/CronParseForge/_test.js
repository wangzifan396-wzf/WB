
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('*/15 match 30', A.fieldMatch('*/15',30)===true);
ok('*/15 miss 7', A.fieldMatch('*/15',7)===false);
ok('1,2,3 match 2', A.fieldMatch('1,2,3',2)===true);
ok('5-7 match 6', A.fieldMatch('5-7',6)===true);
ok('5-7 miss 8', A.fieldMatch('5-7',8)===false);
ok('* match 9', A.fieldMatch('*',9)===true);
ok('parse 5 fields', A.parse('*/15 0 1 * *')!==null);
console.log('CronParseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
