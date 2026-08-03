
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('git', C.fix('gti status','').value.fixed==='git status');
ok('sudo', C.fix('apt install vim','').value.fixed==='sudo apt install vim');
ok('perm', C.fix('rm /x','permission denied').value.fixed==='sudo rm /x');
ok('npm', C.fix('npm isntall x','').value.fixed==='npm install x');
ok('none', C.fix('ls','').value.fixed===null);
ok('root', C.fix('mkdir /foo','').value.fixed==='sudo mkdir /foo');
console.log((fail?'FAIL':'PASS')+' ThefuckForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);