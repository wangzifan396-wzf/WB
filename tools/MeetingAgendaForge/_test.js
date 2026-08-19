
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var raw='开场\n需求评审 @20\n总结';
var t=A.parseTopics(raw);
ok('cnt', t.length===3);
ok('mins', t[1].mins===20 && t[2].mins===null);
var a=A.buildAgenda('Sprint',60, raw, '09:00');
ok('slots', a.slots.length===3);
ok('sum', a.slots.reduce(function(s,x){return s+x.mins;},0)===60);
ok('contig', a.slots[0].end===a.slots[1].start);
ok('notes', a.notesTemplate.indexOf('决议')>=0);
ok('err', !!A.buildAgenda('X',0,raw).error);
ok('over', !!A.buildAgenda('X',30,'a @40\nb @40').error);
console.log('MeetingAgendaForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
