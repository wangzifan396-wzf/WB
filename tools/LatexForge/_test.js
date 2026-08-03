
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var f=A.latexToHtml('\\frac{a}{b}');
ok('frac', f.indexOf('<span class="frac">')>=0 && f.indexOf('a')>=0 && f.indexOf('b')>=0);
ok('sup', A.latexToHtml('x^2').indexOf('<sup>2</sup>')>=0);
ok('sub', A.latexToHtml('x_0').indexOf('<sub>0</sub>')>=0);
ok('sqrt', A.latexToHtml('\\sqrt{x}').indexOf('√')>=0);
ok('greek', A.latexToHtml('\\alpha').indexOf('α')>=0);
console.log('LatexForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
