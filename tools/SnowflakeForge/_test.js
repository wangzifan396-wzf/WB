const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('isValid num', A.isValid('123456789'));
ok('isValid nonnum', A.isValid('abc')===false);
ok('isValid empty', A.isValid('')===false);
ok('epoch default const', A.epochDefault===1288834974657);
ok('compose zero', A.compose({timestamp:1288834974657, datacenterId:0, workerId:0, sequence:0, epoch:1288834974657}).id==='0');
var c = A.compose({timestamp:1288834974657+1000, datacenterId:1, workerId:2, sequence:5, epoch:1288834974657});
ok('compose id string', typeof c.id==='string');
var p = A.parse(c.id, {epoch:1288834974657});
ok('parse timestamp', p.timestamp === 1288834974657+1000);
ok('parse dc', p.datacenterId===1);
ok('parse worker', p.workerId===2);
ok('parse seq', p.sequence===5);
ok('parse date iso', typeof p.date==='string' && p.date.indexOf('2010')===0);
var p0 = A.parse('0', {epoch:1288834974657});
ok('parse zero date', p0.date.indexOf('2010-11-04')>=0);
ok('parse bad', A.parse('xyz').error!==undefined);
ok('parse float rejects', A.parse('1.2').error!==undefined);
console.log('SnowflakeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
