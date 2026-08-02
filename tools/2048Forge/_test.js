
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var b=P.g2Init(7);
ok(b.length===16,'init 16 cells');
ok(b.filter(function(v){return v;}).length===2,'init 2 tiles');
ok(b.every(function(v){return v===0||v===2||v===4;}),'init values 2/4');
// left merge
var t=[2,2,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
var r=P.g2Move(t,3);
ok(r.board[0]===4 && r.board[1]===0,'merge left -> 4');
ok(r.score===4,'score added');
ok(r.moved===true,'moved true');
// no-op move
var full=[2,4,2,4, 4,2,4,2, 2,4,2,4, 4,2,4,2];
ok(P.g2Move(full,3).moved===false,'no move when blocked');
// spawn increases tile
var e=P.g2Spawn(t.slice(), P.g2Rng(5));
ok(e.filter(function(v){return v;}).length===3,'spawn adds one tile');
// game over
ok(P.g2Over(full)===true,'checkerboard is over');
ok(P.g2Over([2,0,2,4, 0,2,4,2, 2,4,2,4, 4,2,4,2])===false,'with empty not over');
ok(P.g2Over([2,2,4,8, 4,8,2,2, 2,4,8,4, 8,2,4,8])===false,'with merge not over');
// win
ok(P.g2Won([2048,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0])===true,'win at 2048');
ok(P.g2Won(b)===false,'no win at init');
// determinism
ok(JSON.stringify(P.g2Init(7))===JSON.stringify(P.g2Init(7)),'init deterministic by seed');
// triple merge: [2,2,2,0] left -> [4,2,0,0]
var tr=P.g2Move([2,2,2,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],3);
ok(tr.board[0]===4 && tr.board[1]===2,'two merges from 2,2,2');
console.log('PASS '+n+' assertions');
