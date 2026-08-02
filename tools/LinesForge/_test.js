const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('dedupe', A.dedupe('a\nb\na')==='a\nb');
ok('dedupe keeps blank once', A.dedupe('a\n\n\nb')==='a\n\nb');
ok('removeEmpty', A.removeEmpty('a\n\nb\n  \nc')==='a\nb\nc');
ok('sort asc', A.sortLines('b\na\nc',false)==='a\nb\nc');
ok('sort desc', A.sortLines('a\nb\nc',true)==='c\nb\na');
ok('reverse', A.reverseLines('a\nb\nc')==='c\nb\na');
ok('trim', A.trimLines('  a  \n b ')==='a\nb');
ok('number', A.numberLines('x\ny',1)==='1. x\n2. y');
ok('number start', A.numberLines('x\ny',10)==='10. x\n11. y');
ok('crlf split', A.splitLines('a\r\nb').length===2);
ok('stats lines', A.countStats('a\nb\nc').lines===3);
ok('stats words', A.countStats('hello world\nfoo').words===3);
console.log('LinesForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
