const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('star same dir', A.isMatch('src/a.js','src/*.js')===true);
ok('star no cross dir', A.isMatch('src/x/a.js','src/*.js')===false);
ok('globstar deep', A.isMatch('src/x/y/a.js','src/**/*.js')===true);
ok('globstar zero', A.isMatch('src/a.js','src/**/*.js')===true);
ok('ext mismatch', A.isMatch('a.txt','*.js')===false);
ok('brace alt js', A.isMatch('a.js','*.{js,ts}')===true);
ok('brace alt ts', A.isMatch('a.ts','*.{js,ts}')===true);
ok('brace alt miss', A.isMatch('a.md','*.{js,ts}')===false);
ok('question single', A.isMatch('file1.txt','file?.txt')===true);
ok('question not multi', A.isMatch('file12.txt','file?.txt')===false);
ok('class in', A.isMatch('a.js','[ab].js')===true);
ok('class out', A.isMatch('c.js','[ab].js')===false);
ok('class negate', A.isMatch('c.js','[!ab].js')===true);
ok('double star all', A.isMatch('any/deep/path','**')===true);
ok('nocase', A.isMatch('README.MD','*.md',{nocase:true})===true);
ok('filter', JSON.stringify(A.filter(['a.js','b.ts','c.js'],'*.js'))===JSON.stringify(['a.js','c.js']));
ok('literal dot', A.isMatch('axjs','*.js')===false);
console.log('GlobForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
