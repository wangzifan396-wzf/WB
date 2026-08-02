
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('date-iso', C.parseDate('2026-08-02 15:30:00 +0800').h===15);
ok('date-iso-y', C.parseDate('2026-08-02T15:30:00Z').y===2026);
ok('date-git', C.parseDate('Sun Aug 2 15:30:00 2026 +0800').mo===7);
ok('date-unix', C.parseDate('1785000000').y>2020);
ok('date-bad', C.parseDate('nope')===null);
ok('date-empty', C.parseDate('')===null);
ok('wd', C.WD.length===7);
ok('bar', C.bar(5,10,10).length===5);
ok('bar-zero', C.bar(1,0,10)==='');
ok('fmtday-bad', C.fmtDay(null)==='-');
ok('empty', C.analyze('').error!=null);
ok('garbage', C.analyze('hello world\nsecond line').error!=null);
const PIPE=[
 'a1|Ada|ada@x.com|2026-07-28 09:00:00 +0800|feat(p): one',
 'b2|Ada|ada@x.com|2026-07-28 23:00:00 +0800|fix: two',
 'c3|Grace|g@x.com|2026-08-01 14:00:00 +0800|docs: three',
 'd4|Grace|g@x.com|2026-08-02 11:00:00 +0800|随手改改',
 'e5|Ada|ada@x.com|2026-08-02 12:00:00 +0800|Merge branch feature'
].join('\n');
const r=C.analyze(PIPE);
ok('ok', !r.error);
const v=r.value;
ok('count', v.summary.commits===5);
ok('authors', v.summary.authors===2);
ok('top', v.authors[0].name==='Ada'&&v.authors[0].count===3);
ok('merge', v.summary.merges===1);
ok('conv', v.types.some(function(t){return t.type==='feat';}));
ok('conv-fix', v.types.some(function(t){return t.type==='fix';}));
ok('convpct', v.summary.convPct===60);
ok('bad', v.badSubject.indexOf('随手改改')>=0);
ok('bad-nomerge', v.badSubject.join('|').indexOf('Merge')<0);
ok('hours', v.byHour[9]===1&&v.byHour[23]===1);
ok('weekday', v.byWeekday.reduce(function(a,b){return a+b;},0)===5);
ok('months', v.months.length===2&&v.months[0].month==='2026-07');
ok('days', v.summary.days>=5);
ok('insights', v.insights.length>=3);
ok('first', C.fmtDay(v.summary.firstTs)==='2026-07-28');
ok('last', C.fmtDay(v.summary.lastTs)==='2026-08-02');
const STD=['commit a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
 'Author: Ada Lovelace <ada@example.com>',
 'Date:   Sun Aug 2 15:30:00 2026 +0800',
 '',
 '    feat: standard format',
 '',
 'commit b1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b1',
 'Merge: 111 222',
 'Author: Grace Hopper <g@example.com>',
 'Date:   Sat Aug 1 10:00:00 2026 +0800',
 '',
 "    Merge branch 'x'",
 ''].join('\n');
const r2=C.analyze(STD);
ok('std-ok', !r2.error);
ok('std-count', r2.value.summary.commits===2);
ok('std-author', r2.value.authors.some(function(a){return a.name==='Ada Lovelace';}));
ok('std-merge', r2.value.summary.merges===1);
ok('std-subject', C.parse(STD)[0].subject==='feat: standard format');
ok('by-email', C.analyze(PIPE,{byEmail:true}).value.authors[0].name==='ada@x.com');
ok('single', C.analyze('x1|Solo|s@x.com|2026-08-02 10:00:00 +0800|chore: init').value.insights.join('|').indexOf('单人仓库')>=0);
ok('weekend', typeof v.summary.weekendPct==='number');
ok('night', typeof v.summary.nightPct==='number');
ok('peak', typeof v.summary.peakHour==='number'&&v.summary.peakWeekday.length>0);
console.log((fail?'FAIL':'PASS')+' GitLogForge '+pass+'/'+fail);process.exit(fail?1:0);
