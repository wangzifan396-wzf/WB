const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function dt(y,mo,d,h,mi){ return new Date(y,mo-1,d,h,mi,0,0); }
ok('parse star', !!A.parse('* * * * *'));
ok('parse bad', A.parse('bad expr')===null);
ok('parse 5 names', !!A.parse('0 0 1 JAN MON'));
ok('fits any for star', A.fits(A.parse('* * * * *'), dt(2026,1,1,0,0)));
var base = dt(2026,1,1,0,0); // Thu 00:00
var n1 = A.next('30 9 * * *', base);
ok('next 30 9 -> 09:30', n1 && n1.getHours()===9 && n1.getMinutes()===30);
var n2 = A.next('*/5 * * * *', base);
ok('next */5 minute %5', n2 && n2.getMinutes()%5===0 && n2.getTime()>base.getTime());
var n3 = A.next('0 0 1 JAN *', dt(2026,6,15,10,0));
ok('next jan1 2027', n3 && n3.getFullYear()===2027 && n3.getMonth()===0 && n3.getDate()===1);
var ns = A.nextN('0 0 * * 1', base, 3);
ok('nextN count', ns.length===3);
ok('nextN increasing', ns[0].getTime()<ns[1].getTime() && ns[1].getTime()<ns[2].getTime());
ok('nextN monday', ns.every(function(d){ return d.getDay()===1; }));
ok('describe star', A.describe('* * * * *')==='每分钟');
ok('describe daily', A.describe('30 9 * * *')==='每天 09:30');
ok('describe every15', A.describe('*/15 * * * *').indexOf('15')>=0);
ok('describe weekday', A.describe('0 0 * * 1-5')==='每周周一、周二、周三、周四、周五 00:00');
console.log('CronForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
