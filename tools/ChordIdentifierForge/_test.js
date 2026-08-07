
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('C,E,G = C major', (function(){var r=A.identify(['C','E','G']); return r.name==='Cmajor';})());
ok('C,Eb,G = C minor', (function(){var r=A.identify(['C','Eb','G']); return r.quality==='minor';})());
ok('E,G,C = C major (inv)', (function(){var r=A.identify(['E','G','C']); return r.root==='C' && r.quality==='major';})());
ok('C,E,G,B = Cmaj7', (function(){var r=A.identify(['C','E','G','B']); return r.quality==='maj7';})());
ok('C,E,G,Bb = C7', (function(){var r=A.identify(['C','E','G','Bb']); return r.quality==='7';})());
ok('C,Eb,Gb = Cdim', (function(){var r=A.identify(['C','Eb','Gb']); return r.quality==='diminished';})());
console.log('ChordIdentifierForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
