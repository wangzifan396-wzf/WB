
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('FR', A.regional('FR')===String.fromCodePoint(0x1F1EB)+String.fromCodePoint(0x1F1F7));
ok('a codepoint', A.regional('a').codePointAt(0)===0x1F1E6);
ok('passthrough', A.regional('@')==='@');
console.log('RegionalForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
