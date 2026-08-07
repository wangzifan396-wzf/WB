
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.generate(11); ok('nonempty', typeof r==='string'&&r.length>0); ok('deterministic', r===A.generate(11));
console.log('RecipeIdeaForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
