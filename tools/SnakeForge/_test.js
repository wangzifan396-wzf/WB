
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var s=P.skNew(10,10);
ok(s.snake.length===2, 'initial length 2');
P.skSetDir(s,[1,0]);
var h0=s.snake[0].slice(); s=P.skStep(s);
ok(s.snake[0][0]===h0[0]+1 && s.snake[0][1]===h0[1], 'moved right by 1');
// eat food
var s2=P.skNew(10,10); s2.food=[s2.snake[0][0]+1, s2.snake[0][1]]; var len0=s2.snake.length;
s2=P.skStep(s2);
ok(s2.snake.length===len0+1, 'grew after eating');
ok(s2.score===1, 'score incremented');
// wall collision
var s3=P.skNew(5,5); s3.snake=[[0,2],[1,2]]; s3.dir=[-1,0];
s3=P.skStep(s3); ok(s3.over===true, 'wall collision ends');
// self collision
var s4=P.skNew(5,5); s4.snake=[[2,2],[2,3],[1,3],[1,2]]; s4.dir=[1,0]; // head moves to (3,2) not self; craft self: head (2,2) move down into body
s4=P.skNew(5,5); s4.snake=[[2,2],[2,1],[3,1],[3,2]]; s4.dir=[0,1]; // head (2,2) -> (2,3) free
s4.dir=[-1,0]; // (2,2)->(1,2) free
s4=P.skStep(s4); s4.dir=[0,1]; s4=P.skStep(s4); // -> (1,3) free
s4.dir=[1,0]; s4=P.skStep(s4); // ->(2,3) free
// force self: make U shape and turn into body
var s5=P.skNew(6,6); s5.snake=[[3,3],[3,4],[2,4],[2,3]]; s5.dir=[1,0]; // head (3,3) -> (4,3)
s5=P.skStep(s5); s5.dir=[0,-1]; s5=P.skStep(s5); // (4,3)->(4,2)
s5.dir=[-1,0]; s5=P.skStep(s5); // (4,2)->(3,2)
s5.dir=[0,1]; s5=P.skStep(s5); // (3,2)->(3,3) which is body -> over
ok(s5.over===true, 'self collision ends');

console.log('PASS '+n+' assertions');
