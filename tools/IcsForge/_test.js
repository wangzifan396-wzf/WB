const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

const STAMP='2026-07-31T04:00:00Z';

// ---- escaping ----
ok(P.escapeText('a, b; c')==='a\\, b\\; c', 'comma and semicolon are escaped');
ok(P.escapeText('line1\nline2')==='line1\\nline2', 'newline becomes \\n');
ok(P.escapeText('a\\b')==='a\\\\b', 'backslash is doubled');

// ---- date parsing ----
ok(P.parseDateTz('2026-08-03').kind==='date', 'date-only input is all-day');
ok(P.parseDateTz('2026-08-03 10:00Z').kind==='utc', 'Z suffix marks UTC');
ok(P.parseDateTz('2026-08-03 10:00 +08:00').kind==='utc', 'offset input normalises to UTC');
ok(P.parseDateTz('2026-08-03 10:00').kind==='float', 'time without zone is floating local');
ok(P.parseDateTz('garbage')===null, 'garbage returns null');
ok(P.stampUtc(new Date(Date.UTC(2026,7,3,2,5,9)))==='20260803T020509Z', 'stampUtc emits the UTC form');
ok(P.stampUtc(P.parseDateTz('2026-08-03 10:00 +08:00').ms!==undefined?new Date(P.parseDateTz('2026-08-03 10:00 +08:00').ms):new Date())==='20260803T020000Z', '+08:00 10:00 maps to 02:00Z');

// ---- event parsing ----
const SRC='# 周会\nstart: 2026-08-03 10:00 +08:00\nend: 2026-08-03 11:00 +08:00\nrepeat: weekly\nloc: 线上\n这是描述第一行\n这是描述第二行';
const evs=P.parseEvents(SRC);
ok(evs.length===1, 'one block parses into one event');
ok(evs[0].title==='周会', 'heading becomes title');
ok(evs[0].repeat==='weekly', 'repeat key captured');
ok(evs[0].loc==='线上', 'loc key captured');
ok(/这是描述第一行/.test(evs[0].desc) && /这是描述第二行/.test(evs[0].desc), 'free-form lines become the description');
ok(P.parseEvents('# only').length===1 && P.parseEvents('# only')[0].start===undefined, 'title-only event has no start');

// ---- build event (UTC) ----
const e1=P.buildEvent({title:'周会',start:'2026-08-03 10:00 +08:00',end:'2026-08-03 11:00 +08:00',repeat:'weekly',loc:'线上',desc:'同步进度'}, {stamp:STAMP});
ok(e1.indexOf('BEGIN:VEVENT')>=0 && e1.indexOf('END:VEVENT')>=0, 'event wraps in VEVENT');
ok(/UID:nano-[0-9a-f]+@icsforge/.test(e1), 'a deterministic UID is generated');
ok(e1.indexOf('DTSTAMP:20260731T040000Z')>=0, 'DTSTAMP uses the supplied stamp');
ok(e1.indexOf('DTSTART:20260803T020000Z')>=0, 'DTSTART converts +08:00 to UTC Z');
ok(e1.indexOf('DTEND:20260803T030000Z')>=0, 'DTEND converts to UTC Z');
ok(e1.indexOf('SUMMARY:周会')>=0, 'SUMMARY carries the escaped title');
ok(e1.indexOf('RRULE:FREQ=WEEKLY')>=0, 'weekly repeat emits FREQ=WEEKLY');
ok(e1.indexOf('LOCATION:线上')>=0, 'LOCATION emitted');

// ---- all-day event ----
const e2=P.buildEvent({title:'假期',start:'2026-10-01',end:'2026-10-02'}, {stamp:STAMP});
ok(e2.indexOf('DTSTART;VALUE=DATE:20261001')>=0, 'all-day start uses VALUE=DATE');
ok(e2.indexOf('DTEND;VALUE=DATE:20261002')>=0, 'explicit end date used for all-day');
const e2b=P.buildEvent({title:'假期',start:'2026-10-01'}, {stamp:STAMP});
ok(e2b.indexOf('DTEND;VALUE=DATE:20261002')>=0, 'all-day end defaults to start + 1 day');

// ---- floating local event ----
const e3=P.buildEvent({title:'本地提醒',start:'2026-08-03 10:00',end:'2026-08-03 11:00'}, {stamp:STAMP});
ok(e3.indexOf('DTSTART:20260803T100000')>=0, 'floating start keeps local time without Z');
ok(e3.indexOf('DTEND:20260803T110000')>=0, 'floating end keeps local time without Z');

// ---- line folding ----
const longDesc='X'.repeat(120);
const e4=P.buildEvent({title:'长描述',start:'2026-08-03 10:00Z',end:'2026-08-03 11:00Z',desc:longDesc}, {stamp:STAMP});
ok(e4.indexOf('\r\n ')>=0, 'a long line is folded with a continuation space');
const folded=e4.split('\r\n').filter(function(l){return l.charAt(0)!==' ';});
ok(folded.every(function(l){return l.length<=75;}), 'every physical line is within 75 octets');
const e4b=P.buildEvent({title:'短',start:'2026-08-03 10:00Z',end:'2026-08-03 11:00Z',desc:'短描述'}, {stamp:STAMP});
ok(e4b.indexOf('\r\n ')===-1, 'short lines are not folded');

// ---- calendar wrapper ----
const cal=P.buildCalendar([{title:'A',start:'2026-08-03 10:00Z',end:'2026-08-03 11:00Z'},{title:'B',start:'2026-08-04 10:00Z',end:'2026-08-04 11:00Z'}], {stamp:STAMP});
ok(cal.indexOf('BEGIN:VCALENDAR')===0, 'calendar starts with VCALENDAR');
ok(cal.indexOf('VERSION:2.0')>=0, 'version 2.0 present');
ok(cal.indexOf('PRODID:-//nano-tools//IcsForge//EN')>=0, 'PRODID identifies the generator');
ok((cal.match(/BEGIN:VEVENT/g)||[]).length===2, 'both events wrapped');
ok(cal.indexOf('END:VCALENDAR')>0, 'calendar closes properly');

// ---- conflicts ----
const conf=P.lintCalendar([
  {title:'A',start:'2026-08-03 10:00Z',end:'2026-08-03 11:00Z'},
  {title:'B',start:'2026-08-03 10:30Z',end:'2026-08-03 11:30Z'}
]);
ok(conf.conflicts.length===1, 'overlapping UTC events are detected as a conflict');
ok(conf.issues.some(function(i){return /冲突/.test(i.msg);}), 'conflict surfaces as an issue');
const noConf=P.lintCalendar([
  {title:'A',start:'2026-08-03 10:00Z',end:'2026-08-03 11:00Z'},
  {title:'B',start:'2026-08-03 12:00Z',end:'2026-08-03 13:00Z'}
]);
ok(noConf.conflicts.length===0, 'non-overlapping events have no conflict');

// ---- lint basics ----
ok(P.lintCalendar([{title:'A',start:'2026-08-03 10:00Z',end:'2026-08-03 09:00Z'}]).issues.some(function(i){return /结束时间/.test(i.msg);}), 'end before start is flagged');
ok(P.lintCalendar([{start:'2026-08-03 10:00Z'}]).issues.some(function(i){return /标题/.test(i.msg);}), 'missing title is flagged');
ok(P.lintCalendar([]).issues.some(function(i){return /没有任何事件/.test(i.msg);}), 'empty calendar is flagged');
ok(P.gradeOf(90)==='A' && P.gradeOf(0)==='F', 'grade thresholds behave');

// ---- RRULE variants ----
ok(P.rruleOf({repeat:'daily'})==='FREQ=DAILY', 'daily maps to FREQ=DAILY');
ok(P.rruleOf({repeat:'weekly',interval:2})==='FREQ=WEEKLY;INTERVAL=2', 'interval is appended');
ok(P.rruleOf({repeat:'weekly',until:'2026-12-31'})==='FREQ=WEEKLY;UNTIL=20261231', 'until date is appended');
ok(P.rruleOf({})==='', 'no repeat yields empty RRULE');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
