
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('A', A.bold('A').codePointAt(0)===0x1D400);
ok('C special', A.bold('C')==='ℂ');
ok('0', A.bold('0').codePointAt(0)===0x1D7CE);
ok('a', A.bold('a').codePointAt(0)===0x1D41A);
console.log('BoldForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
