
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var j1=A.json5Parse("{a:1, b:2, /* c */ c:3,}");
ok('json5_keys', j1.a===1&&j1.b===2&&j1.c===3);
var j2=A.json5Parse("[1, 2, 3,]");
ok('json5_arr', j2[1]===2&&j2.length===3);
var j3=A.json5Parse("'single quoted'");
ok('json5_single', j3==='single quoted');
var j4=A.json5Parse('0x1F');
ok('json5_hex', j4===31);
var j5=A.json5Parse("{name:'demo',retry:3,ratio:0.5,flags:[true,false,null],hex:0x1F}");
ok('json5_mixed', j5.name==='demo'&&j5.retry===3&&j5.ratio===0.5&&j5.flags[1]===false&&j5.hex===31);
var j6=A.json5Parse('[.25,-Infinity,NaN,1e3]');
ok('json5_nums', j6[0]===0.25&&j6[1]===-Infinity&&isNaN(j6[2])&&j6[3]===1000);
ok('json5_nan', isNaN(A.json5Parse('NaN')));
console.log('Json5Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
