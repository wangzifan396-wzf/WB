
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('reveal', A.reveal('cat',['a'])==='_ a _');
ok('reveal2', A.reveal('cat',['c','a','t'])==='c a t');
ok('win', A.status('cat',['c','a','t'],0)==='win');
ok('lose', A.status('cat',[],6)==='lose');
ok('playing', A.status('cat',['a'],2)==='playing');
console.log('HangmanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
