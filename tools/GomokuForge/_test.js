
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var g=P.gmNew();
g[7][0]=1; g[7][1]=1; g[7][2]=1; g[7][3]=1; g[7][4]=1;
ok(P.gmWin(g,4,7,1), 'horizontal 5');
var g2=P.gmNew(); for(var i=0;i<4;i++) g2[i][2]=2;
ok(!P.gmWin(g2,2,2,2), '4 not win');
g2[4][2]=2; ok(P.gmWin(g2,2,4,2), 'vertical 5');

// AI takes winning move
var g3=P.gmNew(); for(var i=0;i<4;i++) g3[5][i]=1;
var mv=P.gmAi(g3,1,2); ok(mv[1]===5 && (mv[0]===4||mv[0]===0), 'AI completes its own 5');

// AI blocks human open four
var g4=P.gmNew(); for(var i=0;i<4;i++) g4[6][i]=2;
var b=P.gmAi(g4,1,2); ok(b[1]===6 && (b[0]===4||b[0]===0), 'AI blocks human open four');

console.log('PASS '+n+' assertions');
