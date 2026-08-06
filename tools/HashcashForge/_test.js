
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.hcMint('test@x.com', 12, 0);
ok('mint format', /^1:12:/.test(s));
ok('check pass', A.hcCheck(s, 12)===true);
ok('check fail low', A.hcCheck(s, 30)===false);
console.log('HashcashForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
