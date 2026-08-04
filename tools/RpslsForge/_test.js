
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rock scissors', A.rpslsPlay('rock','scissors')==='win');
ok('rock lizard', A.rpslsPlay('rock','lizard')==='win');
ok('rock spock', A.rpslsPlay('rock','spock')==='lose');
ok('spock rock', A.rpslsPlay('spock','rock')==='win');
ok('tie', A.rpslsPlay('rock','rock')==='tie');
ok('valid cpu', ['rock','paper','scissors','lizard','spock'].indexOf(A.rpslsCpu())>=0);
console.log('RpslsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
