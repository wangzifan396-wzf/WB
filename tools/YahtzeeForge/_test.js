
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sixes', A.yahScore('sixes',[6,6,6,2,3])===18);
ok('three', A.yahScore('three',[3,3,3,1,2])===12);
ok('full', A.yahScore('full',[2,2,3,3,3])===25);
ok('sm', A.yahScore('sm',[1,2,3,4,6])===30);
ok('lg', A.yahScore('lg',[2,3,4,5,6])===40);
ok('yah', A.yahScore('yah',[5,5,5,5,5])===50);
ok('chance', A.yahScore('chance',[1,2,3,4,5])===15);
ok('best sixes', A.yahBest([6,6,6,2,3]).cat==='three');
console.log('YahtzeeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
