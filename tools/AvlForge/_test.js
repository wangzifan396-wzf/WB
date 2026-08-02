const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
function build(keys){ let root=null, log=[]; for(const k of keys){ const r=A.avlInsert(root,k,log); root=r.value; } return { root, log }; }
// RR case: 10,20,30 -> left rotation, root becomes 20
const rr=build([10,20,30]);
ok('RR root 20', rr.root.key===20);
ok('RR log', rr.log.some(s=>/左旋/.test(s)));
ok('RR height 2', A.avlHeight(rr.root)===2);
// LL case: 30,20,10 -> right rotation
const ll=build([30,20,10]);
ok('LL root 20', ll.root.key===20);
// LR case: 30,10,20
const lr=build([30,10,20]);
ok('LR root 20', lr.root.key===20);
ok('LR log', lr.log.some(s=>/先左后右/.test(s)));
// RL case: 10,30,20
const rl=build([10,30,20]);
ok('RL root 20', rl.root.key===20);
ok('RL log', rl.log.some(s=>/先右后左/.test(s)));
// classic sequence
const c=build([10,20,30,40,50,25]);
ok('classic root 30', c.root.key===30);
ok('classic inorder sorted', J(A.avlInorder(c.root))===J([10,20,25,30,40,50]));
const v=A.avlValidate(c.root);
ok('classic valid', v.bst && v.balanced);
// 1..15 ascending stays log-height
const big=build(Array.from({length:15},(_,i)=>i+1));
ok('15 keys height 4', A.avlHeight(big.root)===4);
ok('15 keys balanced', A.avlValidate(big.root).balanced);
// duplicate + bad input
const d=A.avlInsert(rr.root, 20, []);
ok('duplicate error', d.error!==null && d.value===rr.root);
ok('NaN error', A.avlInsert(null, NaN, []).error!==null);
ok('render nonempty', A.avlRender(rr.root).indexOf('20')>=0);
console.log('AvlForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
