const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b,e){ return Math.abs(a-b)<=(e||1e-6); }
function C(){ return A.convert.apply(null, arguments).value; }
ok('km->m', near(C(1,'km','m','length'),1000));
ok('cm->m', near(C(100,'cm','m','length'),1));
ok('mi->km', near(C(1,'mi','km','length'),1.609344,1e-5));
ok('kg->g', near(C(1,'kg','g','mass'),1000));
ok('lb->kg', near(C(1,'lb','kg','mass'),0.45359237,1e-6));
ok('C->F 0', near(C(0,'C','F','temperature'),32));
ok('C->F 100', near(C(100,'C','F','temperature'),212));
ok('C->K 0', near(C(0,'C','K','temperature'),273.15));
ok('h->min', near(C(1,'h','min','time'),60));
ok('KiB->KB', near(C(1,'KiB','KB','data'),1.024,1e-9));
ok('KiB->B', near(C(1,'KiB','B','data'),1024,1e-9));
ok('kpa->pa', near(C(1,'kpa','pa','pressure'),1000));
ok('unknown cat', A.convert(1,'km','m','xx').error!==undefined);
ok('unknown unit', A.convert(1,'km','xx','length').error!==undefined);
ok('temp unknown', A.convert(0,'X','C','temperature').error!==undefined);
console.log('UnitForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
