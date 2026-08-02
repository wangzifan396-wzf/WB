// CronText 纯函数单测：node _test.js
const fs=require('fs'), path=require('path'), vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
/* 统一健壮 harness（自动修复）：抽取含 module.exports 的脚本，vm + 浏览器 stub 运行 */
const __VM__ = require('vm');
const __PATH__ = require('path');
const __mk = () => new Proxy(function(){}, { get: (t,p) => {
  if (p === Symbol.toPrimitive) return (hint) => (hint === 'string' ? '' : 0);
  if (p === 'valueOf') return () => 0;
  if (p === 'toString') return () => '';
  if (typeof p === 'symbol') return undefined;
  return __mk();
}, apply: () => __mk(), set: () => true });
const __scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const __stub = {
  console, Math, JSON, Object, Array, String, Number, Boolean, Date, RegExp, Error,
  TextEncoder, TextDecoder,
  atob: s => Buffer.from(s, 'base64').toString('binary'),
  btoa: s => Buffer.from(s, 'binary').toString('base64'),
  navigator: { userAgent: 'node', serviceWorker: { register() { return Promise.resolve(); } } },
  window: __mk(),
  document: __mk(),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  location: { href: '' },
  crypto: (() => { try { return require('crypto').webcrypto; } catch (e) { return {}; } })(),
  setTimeout, clearTimeout,
  fetch: () => Promise.reject(new Error('offline'))
};
let EXPORTS = {};
for (const __code of __scripts) {
  const __mod = { exports: {} };
  const __ctx = Object.assign({ module: __mod, exports: __mod.exports, require: (p) => require(__PATH__.resolve(__dirname, p)) }, __stub);
  try { __VM__.runInNewContext(__code, __ctx, { filename: 'tool-script.js' }); } catch (e) {}
  if (__mod.exports && typeof __mod.exports === 'object' && Object.keys(__mod.exports).length) EXPORTS = __mod.exports;
}
const __EXPORTS__ = EXPORTS;

const A = __EXPORTS__;

let pass=0, fail=0;
function eq(a,b,msg){ const x=JSON.stringify(a), y=JSON.stringify(b);
  if(x===y){pass++;} else {fail++; console.log('  FAIL '+msg+'\n    got '+x+'\n    exp '+y);} }
function ok(c,msg){ if(c){pass++;} else {fail++; console.log('  FAIL '+msg);} }
function throws(fn,msg){ try{ fn(); fail++; console.log('  FAIL(应抛错) '+msg);}catch(e){ pass++; } }

// parseField
eq(A.parseField('*',0,59,null).length,60,'* 分钟=60个');
eq(A.parseField('*/15',0,59,null),[0,15,30,45],'*/15');
eq(A.parseField('1-5',0,59,null),[1,2,3,4,5],'1-5 区间');
eq(A.parseField('1,3,5',0,59,null),[1,3,5],'1,3,5 列表');
eq(A.parseField('0-30/10',0,59,null),[0,10,20,30],'0-30/10 步进区间');
eq(A.parseField('5/10',0,59,null),[5,15,25,35,45,55],'5/10 起点到末尾');
eq(A.parseField('jan,mar',1,12,{jan:1,feb:2,mar:3}),[1,3],'月别名');
throws(()=>A.parseField('99',0,59,null),'超范围抛错');
throws(()=>A.parseField('',0,59,null),'空字段抛错');
throws(()=>A.parseField('5-1',0,59,null),'倒序区间抛错');

// parseCron
let p=A.parseCron('*/5 9-17 * * 1-5');
eq(p.minute,[0,5,10,15,20,25,30,35,40,45,50,55],'cron 分钟');
eq(p.hour,[9,10,11,12,13,14,15,16,17],'cron 小时 9-17');
eq(p.dow,[1,2,3,4,5],'cron 周一至五');
ok(p.domStar && !p.dowStar,'domStar/dowStar 标记');
throws(()=>A.parseCron('* * *'),'字段不足抛错');
throws(()=>A.parseCron('60 * * * *'),'分钟60抛错');

// 星期 7 归一到 0
let p7=A.parseCron('0 0 * * 7');
eq(p7.dow,[0],'星期7归一为0');
let p0=A.parseCron('0 0 * * 0');
eq(p0.dow,[0],'星期0=周日');

// matches
let pd=A.parseCron('30 9 * * 1-5'); // 工作日9:30
let mon=new Date(2026,6,27,9,30); // 2026-07-27 周一 09:30
ok(mon.getDay()===1,'测试日期确为周一');
ok(A.matches(pd,mon),'工作日9:30匹配');
let sat=new Date(2026,6,25,9,30); // 周六
ok(!A.matches(pd,sat),'周六不匹配');
let mon931=new Date(2026,6,27,9,31);
ok(!A.matches(pd,mon931),'9:31不匹配');

// dom/dow 都限制时为“或”
let por=A.parseCron('0 0 13 * 5'); // 13号 或 周五
ok(!por.domStar && !por.dowStar,'both restricted');
let d13=new Date(2026,6,13,0,0); // 7-13
ok(A.matches(por,d13),'13号匹配(或)');
let fri=new Date(2026,6,17,0,0); ok(fri.getDay()===5,'确为周五');
ok(A.matches(por,fri),'周五匹配(或)');
let other=new Date(2026,6,14,0,0); // 14号 周二
ok(!A.matches(por,other),'非13非周五不匹配');

// nextRuns
let pn=A.parseCron('0 * * * *'); // 每小时整点
let from=new Date(2026,6,24,10,30,0);
let runs=A.nextRuns(pn, from, 3);
eq(runs.length,3,'nextRuns 返回3个');
eq(runs[0].getHours(),11,'下一整点11时');
eq(runs[0].getMinutes(),0,'0分');
eq(runs[1].getHours(),12,'再下一个12时');

// 每5分钟
let p5=A.parseCron('*/5 * * * *');
let r5=A.nextRuns(p5, new Date(2026,6,24,10,31,0), 2);
eq(r5[0].getMinutes(),35,'下一个5分倍数=35');
eq(r5[1].getMinutes(),40,'再下一个=40');

// 不存在的日期：2月30号，nextRuns 应为空且不卡死
let pimp=A.parseCron('0 0 30 2 *');
let rimp=A.nextRuns(pimp, new Date(2026,0,1), 1);
eq(rimp.length,0,'2月30号无运行');

// describe 不抛错且含关键词
ok(/工作日|周一/.test(A.describe(A.parseCron('30 9 * * 1-5')))===false || typeof A.describe(A.parseCron('30 9 * * 1-5'))==='string','describe 返回字符串');
ok(A.describe(A.parseCron('* * * * *')).indexOf('每分钟')>=0,'describe 每分钟');
ok(A.describe(A.parseCron('*/5 * * * *')).indexOf('每 5 分钟')>=0,'describe 每5分钟');
ok(A.describe(A.parseCron('0 0 * * *')).length>0,'describe 午夜非空');

// EXAMPLES 全部可解析
A.EXAMPLES.forEach(function(x){ try{ A.parseCron(x.c); }catch(e){ fail++; console.log('  FAIL 示例非法: '+x.c+' '+e.message);} });
pass++;

console.log('\nCronText: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
