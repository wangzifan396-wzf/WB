
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var lvl=["#######","#@$  .#","#######"];
var s=P.skParse(lvl);
ok(s.player.x===1&&s.player.y===1,'player parsed');
ok(s.boxes.length===1,'one box');
ok(P.skAt(s,5,1)===2,'target at (5,1)');
// push box right three times to reach target (5,1)
var s1=P.skMove(s,1);
ok(s1.player.x===2&&s1.player.y===1,'player moved right');
ok(s1.boxes[0].x===3&&s1.boxes[0].y===1,'box pushed to (3,1)');
var s1b=P.skMove(s1,1);
ok(s1b.boxes[0].x===4,'box pushed to (4,1)');
var s1c=P.skMove(s1b,1);
ok(s1c.boxes[0].x===5&&s1c.boxes[0].y===1,'box reaches target (5,1)');
ok(P.skWin(s1c)===true,'win after 3 pushes');
// box pushed onto target cell with wall directly behind (valid push, wins)
var s2=P.skParse(["#####","#@$.#","#####"]);
var s3=P.skMove(s2,1);
ok(s3.boxes[0].x===3,'box pushed onto target cell');
ok(P.skWin(s3)===true,'win with wall behind target');
// two boxes adjacent block
var s4=P.skParse(["#####","#@$$.#","#####"]);
var s5=P.skMove(s4,1);
ok(s5===s4 || (s5.player.x===1&&s5.boxes.length===2),'two boxes block push');
// move up into wall ignored
var s6=P.skMove(s,0);
ok(s6===s,'move into wall returns unchanged');
// determinism
ok(JSON.stringify(P.skMove(s,1))===JSON.stringify(s1),'deterministic');
// non-win at start
ok(P.skWin(s)===false,'not won at start');
console.log('PASS '+n+' assertions');
