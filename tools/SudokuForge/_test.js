
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var full=P.sdClone(P.sdEmpty());
full[0]=[5,3,4,6,7,8,9,1,2];
ok(P.sdValid(full), 'valid full grid');
full[0][1]=5; // dup in row
ok(!P.sdValid(full), 'invalid dup detected');

var puzzle=[
 [5,3,0,0,7,0,0,0,0],
 [6,0,0,1,9,5,0,0,0],
 [0,9,8,0,0,0,0,6,0],
 [8,0,0,0,6,0,0,0,3],
 [4,0,0,8,0,3,0,0,1],
 [7,0,0,0,2,0,0,0,6],
 [0,6,0,0,0,0,2,8,0],
 [0,0,0,4,1,9,0,0,5],
 [0,0,0,0,8,0,0,7,9]];
var sol=P.sdClone(puzzle);
ok(P.sdSolveGrid(sol)!==null, 'solve returns grid');
ok(P.sdValid(sol) && sol[0][2]===4, 'solved valid & cell set');

var gen=P.sdGenerate(12345, 48);
ok(gen.puzzle.length===9 && gen.puzzle[0].length===9, 'puzzle shape');
ok(P.sdCountSolutions(P.sdClone(gen.puzzle),2)===1, 'unique solution');
var gen2=P.sdGenerate(12345, 48);
ok(JSON.stringify(gen.puzzle)===JSON.stringify(gen2.puzzle), 'deterministic by seed');

console.log('PASS '+n+' assertions');
