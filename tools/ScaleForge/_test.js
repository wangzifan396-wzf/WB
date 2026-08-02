
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }
function near(n,g,e,eps){ if(Math.abs(g-e)<=(eps||1e-6)) pass++; else {fail++;console.error('FAIL '+n+': got '+g+' want~'+e);} }

eq('parse C4', C.parseNote('C4'), 60);
eq('parse A4', C.parseNote('A4'), 69);
eq('parse C#4', C.parseNote('C#4'), 61);
eq('parse Db4', C.parseNote('Db4'), 61);
eq('parse Bb3', C.parseNote('Bb3'), 58);
ok('parse bad', C.parseNote('H4')===null);
near('freq A4', C.midiToFreq(69), 440);
near('freq B4', C.midiToFreq(71), 493.883, 0.001);

{
  const r=C.generate('C4','major',1);
  eq('major ok', r.error, '');
  eq('major count', r.value.count, 8);
  eq('major first', r.value.notes[0].name, 'C4');
  eq('major last', r.value.notes[7].name, 'C5');
  eq('major 7th freq', r.value.notes[6].freq, 493.883);
}
{
  const r=C.generate('A4','minor_pentatonic',1);
  eq('penta count', r.value.count, 6);
  eq('penta notes', r.value.notes.map(function(n){return n.name;}).join(','), 'A4,C5,D5,E5,G5,A5');
}
eq('chromatic count', C.generate('C4','chromatic',1).value.count, 13);
eq('whole tone count', C.generate('C4','whole_tone',1).value.count, 7);
ok('scale bad type', /未知/.test(C.generate('C4','nope',1).error));
ok('scale bad root', /根音/.test(C.generate('H4','major',1).error));
{
  const r=C.generate('C4','major',1,true);
  eq('flats C4', r.value.notes[0].name, 'C4');
  eq('flats Eb', C.generate('C4','major',1,true).value.notes[3].name, 'F4'); // F natural
  eq('flats Db', C.generate('D4','major',1,true).value.notes[0].name, 'D4');
}

{
  const r=C.interval('C4','E4');
  eq('int semis', r.value.semitones, 4);
  eq('int name', r.value.name, '大三度(M3)');
}
{
  const r=C.interval('C4','C5');
  eq('octave', r.value.semitones, 12);
  eq('octave name', r.value.name, '纯八度(P8)');
}
ok('int bad', /音符/.test(C.interval('H4','E4').error));

{
  const r=C.transpose('C4',2);
  eq('transpose up', r.value.to, 'D4');
  eq('transpose semis', r.value.semitones, 2);
}
eq('transpose down', C.transpose('E4',-2).value.to, 'D4');

console.log((fail?'FAIL':'PASS')+' ScaleForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
