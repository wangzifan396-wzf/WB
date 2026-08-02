const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('format 0', A.formatMs(0,false)==='00:00');
ok('format 65s', A.formatMs(65000,false)==='01:05');
ok('format 1h', A.formatMs(3661000,false)==='01:01:01');
ok('format ms', A.formatMs(650,true)==='00:00.6');
ok('parse sec', A.parseCountdown('90')===90);
ok('parse mmss', A.parseCountdown('01:30')===90);
ok('parse hms', A.parseCountdown('1:00:00')===3600);
ok('roundtrip', A.parseCountdown(A.formatMs(65000,false))===65);
console.log('TimerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
