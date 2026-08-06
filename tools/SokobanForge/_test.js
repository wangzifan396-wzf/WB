
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var st=A.sbParse(["#####","#@$.#","#####"]);
ok('parse player', st.player[0]===1 && st.player[1]===1);
ok('parse box', st.boxes.length===1 && st.boxes[0][0]===2);
var st2=A.sbMove(st,'R');
ok('push box', st2.boxes[0][0]===3 && st2.player[0]===2);
ok('won', A.sbWon(st2)===true);
var st3=A.sbMove(st,'L');
ok('wall block', st3.player[0]===1);
console.log('SokobanForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
