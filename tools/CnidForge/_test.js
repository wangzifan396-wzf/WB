const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
// 用一个确定合法的号（按算法补校验位）
function build17(body17){ var W=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],CODE='10X98765432'; var s=0; for(var i=0;i<17;i++)s+=(+body17[i])*W[i]; return body17+CODE[s%11]; }
var good=build17('11010519491231002');
ok('valid', C.validate(good).value && C.validate(good).value.valid===true);
ok('badlen', !!C.validate('123').error);
ok('badcheck', !!C.validate('110105194912310021').error);
ok('birth', C.validate(good).value.birth==='1949-12-31');
ok('gender', C.validate(good).value.gender==='女');
ok('region', C.validate(good).value.region==='北京');
console.log((fail?'FAIL':'PASS')+' CnidForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);