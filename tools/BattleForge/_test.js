
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var st={board:new Array(100).fill(0), ships:[{cells:[0,1],hits:[false,false]}]}; st.board[0]=1; st.board[1]=1;
ok('hit', A.bsFire(st,0,0).result==='hit');
ok('sunk', A.bsFire(st,0,1).sunk===true);
ok('all', A.bsAllSunk(st)===true);
ok('miss', A.bsFire({board:new Array(100).fill(0),ships:[]},0,0).result==='miss');
ok('fleet sizes', A.BS_FLEET.length===5);
console.log('BattleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
