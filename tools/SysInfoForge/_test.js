
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var s=C.snapshot({userAgent:'Mozilla/5.0',platform:'Linux',language:'zh-CN',languages:['zh-CN','en'],hardwareConcurrency:8,deviceMemory:8,cookieEnabled:true,maxTouchPoints:0,userAgentData:{platform:'Linux'}},{width:1920,height:1080,availWidth:1920,availHeight:1040,colorDepth:24},{}).value;
ok('ua', s.userAgent==='Mozilla/5.0');
ok('cores', s.cores===8);
ok('mem', s.memory===8);
ok('scr', s.screenW===1920 && s.screenH===1080);
ok('dpr', s.pixelRatio===1);
ok('tz', 'timezone' in s);
console.log((fail?'FAIL':'PASS')+' SysInfoForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);