const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('hashStr empty', A.hashStr('')===2166136261);
ok('hashStr det', A.hashStr('abc')===A.hashStr('abc'));
ok('identicon svg', A.identiconSvg('test',64).indexOf('<svg')===0);
ok('identicon rect', A.identiconSvg('test',64).indexOf('rect')>0);
ok('identicon det', A.identiconSvg('test',64)===A.identiconSvg('test',64));
ok('datauri', A.svgToDataUri('<svg/>').indexOf('data:image/svg+xml,')===0);
console.log('AvatarForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
