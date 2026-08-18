
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('create', A.createGame(2).players.length===2);
var g=A.createGame(2); var r=A.step(g,5); ok('move', g.players[0].pos===5 && g.turn===1);
var g2=A.createGame(2); g2.players[1].pos=5; g2.turn=0; A.step(g2,5); ok('capture', g2.players[1].pos===0);
var g3=A.createGame(2); g3.players[0].pos=48; A.step(g3,5); ok('win', g3.over===true && g3.winner===0);
ok('die', A.rollDie(rngFactory(3))>=1 && A.rollDie(rngFactory(3))<=6);
console.log('LudoForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
