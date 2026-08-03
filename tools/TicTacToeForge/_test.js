
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('row X', A.winner(['X','X','X',null,null,null,null,null,null])==='X');
ok('row O', A.winner([null,null,null,'O','O','O',null,null,null])==='O');
ok('none', A.winner([null,null,null,null,null,null,null,null,null])===null);
ok('draw det', A.winner(['X','O','X','X','O','O','O','X','X'])==='draw');
ok('move valid', (function(){var b=[null,null,null,null,null,null,null,null,null]; var mv=A.bestMove(b); return mv>=0&&mv<9&&b[mv]===null;})());
ok('block', A.bestMove(['X',null,null,null,null,null,null,null,null])===4);
console.log('TicTacToeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
