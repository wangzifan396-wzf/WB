
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('plain', A.joinLines('a\nb\nc','\n',{})==='a\nb\nc');
ok('space skip', A.joinLines('a\n\nb',' ',{skipEmpty:true})==='a b');
ok('trim', A.joinLines(' a ','-',{trim:true})==='a');
ok('number', A.joinLines('x\ny',', ',{number:true})==='1. x, 2. y');
console.log('JoinForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
