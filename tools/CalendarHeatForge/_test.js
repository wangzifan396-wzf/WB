const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

ok(P.fromISO('2026-01-01')===Date.UTC(2026,0,1), 'ISO date parsed as UTC midnight');
ok(P.fromISO('2026-2-3')===Date.UTC(2026,1,3), 'single-digit month and day accepted');
ok(P.fromISO('2026-02-30')===null, 'invalid calendar date rejected');
ok(P.fromISO('2026-13-01')===null, 'month out of range rejected');
ok(P.fromISO('not a date')===null, 'garbage rejected');
ok(P.toISO(Date.UTC(2026,11,5))==='2026-12-05', 'timestamp formatted back to ISO');
ok(P.dow(Date.UTC(2026,0,1))===4, '2026-01-01 is a Thursday');
ok(P.toISO(P.addDays(Date.UTC(2026,0,31),1))==='2026-02-01', 'addDays crosses month boundary');

const p=P.parseEntries('2026-01-01 2\n2026-01-01 3\n2026-01-03 4\n# note\n2026-01-05\nbad row\n2026-99-99 1');
ok(p.entries.length===3, 'three distinct dates collected');
ok(p.map['2026-01-01']===5, 'same-day values accumulate');
ok(p.map['2026-01-05']===1, 'bare date counts as one');
ok(p.errors.length===2, 'malformed row and invalid date reported');
ok(p.entries[0].date==='2026-01-01' && p.entries[2].date==='2026-01-05', 'entries sorted ascending');
ok(P.parseEntries('2026-01-02, 7').map['2026-01-02']===7, 'comma separator supported');
ok(P.parseEntries('').entries.length===0, 'empty input yields no entries');

const rg=P.rangeOf(p.entries,{});
ok(P.toISO(rg.start)==='2026-01-01' && P.toISO(rg.end)==='2026-01-05', 'range derived from data');
const rg2=P.rangeOf(p.entries,{start:'2026-01-02',end:'2026-01-04'});
ok(P.toISO(rg2.start)==='2026-01-02', 'explicit start wins');
const rg3=P.rangeOf(p.entries,{start:'2026-01-10',end:'2026-01-01'});
ok(rg3.start<rg3.end, 'reversed range is normalised');
ok(P.rangeOf([],{}).start===null, 'no data and no bounds yields null range');

ok(P.levelOf(0,10)===0, 'zero value maps to level zero');
ok(P.levelOf(1,10)===1, 'small value maps to level one');
ok(P.levelOf(5,10)===2, 'half of max maps to level two');
ok(P.levelOf(10,10)===4, 'max maps to top level');
ok(P.levelOf(3,0)===1, 'positive value with zero max still lights up');

const grid=P.buildGrid(p,{start:'2026-01-01',end:'2026-01-14'});
ok(grid.empty===false, 'grid built');
ok(grid.days===14, 'grid counts the requested days');
ok(grid.weeks.every(function(w){ return w.length===7; }), 'every column holds seven cells');
ok(grid.weeks[0][0].dow===1, 'default week starts on Monday');
ok(grid.weeks[0].some(function(c){ return !c.inRange; }), 'leading padding cells marked out of range');
ok(grid.max===5, 'grid max comes from in-range values');
const sun=P.buildGrid(p,{start:'2026-01-01',end:'2026-01-14',weekStart:0});
ok(sun.weeks[0][0].dow===0, 'weekStart 0 begins on Sunday');
ok(P.buildGrid({entries:[],map:{}},{}).empty===true, 'no data yields empty grid');

const s=P.stats(p,grid);
ok(s.total===10, 'stats total sums in-range values');
ok(s.active===3, 'active days counted');
ok(s.days===14, 'stats day count matches grid');
ok(s.best.date==='2026-01-01' && s.best.value===5, 'peak day identified');
ok(s.longestStreak===1, 'longest streak of isolated days is one');
ok(s.coverage>21 && s.coverage<22, 'coverage percentage computed');
ok(s.weekday.length===7, 'weekday breakdown has seven rows');
const run3=P.parseEntries('2026-03-02 1\n2026-03-03 1\n2026-03-04 1');
const g3=P.buildGrid(run3,{});
ok(P.stats(run3,g3).longestStreak===3, 'consecutive days form a streak');
ok(P.stats(run3,g3).currentStreak===3, 'streak running to the end is the current streak');
ok(P.stats({entries:[],map:{}},P.buildGrid({entries:[],map:{}},{})).total===0, 'stats on empty grid is safe');

const ml=P.monthLabels(grid);
ok(ml.length>=1 && ml[0].name==='1月', 'month labels generated');
ok(P.monthLabels({empty:true}).length===0, 'empty grid yields no month labels');

const svg=P.toSvg(grid);
ok(svg.indexOf('<svg')===0, 'svg output starts with svg tag');
ok(svg.indexOf('role="img"')>0, 'svg carries an accessibility role');
ok(svg.indexOf('<title>2026-01-01：5</title>')>0, 'cell tooltip shows date and value');
ok((svg.match(/<rect/g)||[]).length>20, 'grid renders many cells');
ok(svg.indexOf('#39D353')>0, 'top level colour present in the legend');
ok(P.toSvg({empty:true}).indexOf('<svg')===0, 'empty grid still yields valid svg');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
