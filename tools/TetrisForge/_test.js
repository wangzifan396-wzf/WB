
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var b=P.ttEmpty();
ok(P.ttCollide(b,'O',0,0,-1), 'above top collides');
ok(P.ttCollide(b,'O',0,-1,0), 'left wall collides');
ok(!P.ttCollide(b,'O',0,0,0), 'valid no collide');
ok(P.ttCollide(b,'O',0,9,0), 'right wall collides');
// full bottom row clears
var fb=P.ttEmpty(); for(var x=0;x<P.TT_W;x++) fb[P.TT_H-1][x]=1;
var r=P.ttClearLines(fb); ok(r.cleared===1, 'clears 1 full row');
ok(r.board[P.TT_H-1].every(function(v){return !v;}), 'bottom now empty');
// rotation changes offsets
var o0=P.ttCells('T',0), o1=P.ttCells('T',1);
ok(JSON.stringify(o0)!==JSON.stringify(o1), 'rotation changes cells');
// step on empty board moves down
var s=P.ttNew(); s.y=0; var before=s.y; s=P.ttStep(s); ok(s.y===before+1, 'step moves down');
// merge + collide with stack
var b2=P.ttEmpty(); b2[P.TT_H-1][3]=1; ok(P.ttCollide(b2,'O',0,3,P.TT_H-2), 'rest on stack collides');
console.log('PASS '+n+' assertions');
