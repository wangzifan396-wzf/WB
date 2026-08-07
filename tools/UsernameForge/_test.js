
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var u=A.gen("aw"); ok('gen aw format', /^[a-z]+_[a-z]+$/.test(u));
var u2=A.gen("awn"); ok('gen awn has number', /^[a-z]+_[a-z]+_\d+$/.test(u2));
var u3=A.gen("cap"); ok('gen cap camel', /^[A-Z][a-z]+[A-Z][a-z]+$/.test(u3));
var b=A.batch(10,"an"); ok('batch len 10', b.length===10); ok('batch an format', b.every(function(x){return /^[a-z]+_[a-z]+$/.test(x);}));
console.log('UsernameForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
