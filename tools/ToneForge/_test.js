
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('noteToFreq(A4)=440', Math.abs(A.noteToFreq("A4")-440)<1e-9);
ok('noteToFreq(A5)=880', Math.abs(A.noteToFreq("A5")-880)<1e-9);
ok('noteToFreq(C4)~261.6256', Math.abs(A.noteToFreq("C4")-261.625565)<1e-3);
ok('freqToNote(440)=A4', A.freqToNote(440)==="A4");
ok('midiToFreq(69)=440', A.midiToFreq(69)===440);
ok('midiToNote(69)=A4', A.midiToNote(69)==="A4");
ok('noteToMidi(A4)=69', A.noteToMidi("A4")===69);
ok('noteToMidi(C#5)=73', A.noteToMidi("C#5")===73);
ok('freqToMidi(440)~69', Math.abs(A.freqToMidi(440)-69)<1e-9);
console.log('ToneForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
