const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var a=A.render('A');
ok('A has 5 rows', a.split('\n').length===5);
ok('A contains hashes', a.indexOf('#')>=0);
ok('unknown char -> space', A.render('@').indexOf('#')<0);
ok('lowercase upcases', A.render('a').split('\n')[0].trim()==='###');
ok('fill char swap', A.render('A',{fill:'*'}).indexOf('#')<0 && A.render('A',{fill:'*'}).indexOf('*')>=0);
var hi=A.render('HI');
ok('HI two glyphs', hi.split('\n')[0].length > 5);
ok('font has letters', Object.keys(A.font).length>=36);
console.log('FigletForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
