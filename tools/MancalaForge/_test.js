
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.mcNew(); ok('init', b[0]===4 && b[6]===0 && b[7]===4 && b[13]===0);
var r=A.mcSow(b,0,0); ok('sow distributed', r.board[4]===5 && r.board[0]===0 && r.board[1]===5 && r.board[2]===5 && r.board[3]===5);
ok('again false', r.again===false);
var cb=new Array(14).fill(0); cb[1]=1; cb[10]=3; var rc=A.mcSow(cb,1,0); ok('capture', rc.board[6]===(1+3) && rc.board[2]===0 && rc.board[10]===0);
var end=new Array(14).fill(0); end[5]=1; var er=A.mcSow(end,5,0); ok('game over sweep', er.winner===0 && er.board[5]===0);
console.log('MancalaForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
