const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('render A', A.render('A')==='.###.\n#...#\n#...#\n#####\n#...#');
ok('render space lines', A.render(' ').split('\n').length===5);
ok('render deterministic', A.render('AB')===A.render('AB'));
ok('box', A.box('Hi')==='┌────┐\n│ Hi │\n└────┘');
ok('leet', A.leet('eleet')==='31337');
ok('leet mixed', A.leet('Test')==='7357');
console.log('AsciiForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
