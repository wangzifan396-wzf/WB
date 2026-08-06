
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-3);}
ok('eV 500', near(A.eVfromNm(500),2.4797,1e-3));
ok('band visible', A.band(550)==="可见光");
ok('band uv', A.band(200)==="紫外");
ok('band ir', A.band(5000)==="红外");
ok('rydberg Hα', near(A.hydrogenLine(3),656.3,0.5));
ok('rydberg Hβ', near(A.hydrogenLine(4),486.1,0.5));
console.log('SpectroscopyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
