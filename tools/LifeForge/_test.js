const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// parse (5x5 to avoid toroidal wrap artifacts)
const BL='.....\n..O..\n..O..\n..O..\n.....';
const p=A.lfParse(BL);
ok('parse ok', p.error===null && p.value[1].join('')==='00100');
ok('parse ragged error', A.lfParse('..\n...').error!==null);
ok('parse bad char error', A.lfParse('.X.').error!==null);
ok('parse empty error', A.lfParse('').error!==null);
ok('star alive', A.lfParse('*')!==null && A.lfParse('*').value[0][0]===1);
// blinker oscillates: vertical -> horizontal -> vertical (period 2)
const b1=A.lfStep(p.value);
ok('blinker turns horizontal', b1[2].join('')==='01110' && b1[1].join('')==='00000');
const b2=A.lfStep(b1);
ok('blinker back vertical', A.lfHash(b2)===A.lfHash(p.value));
// block is still life
const blk=A.lfParse('....\n.OO.\n.OO.\n....');
ok('block still life', A.lfHash(A.lfStep(blk.value))===A.lfHash(blk.value));
// underpopulation & overpopulation
ok('lone cell dies', A.lfCount(A.lfStep(A.lfParse('...\n.O.\n...').value))===0);
ok('birth rule n=3', A.lfStep(A.lfParse('...\nOOO\n...').value)[0][1]===1);
// glider moves: after 4 gens shifted by (1,1), cell count constant 5
const g0=A.lfPattern('glider', 10).value;
let g=g0; for(let i=0;i<4;i++) g=A.lfStep(g);
ok('glider keeps 5 cells', A.lfCount(g)===5);
ok('glider moved', A.lfHash(g)!==A.lfHash(g0));
let shifted=g0.map(r=>r.slice());
// build expected: shift g0 down-right by 1 (toroidal not hit at grid 10)
let exp=[]; for(let y=0;y<10;y++){ exp.push([]); for(let x=0;x<10;x++) exp[y].push(0); }
for(let y=0;y<10;y++) for(let x=0;x<10;x++) if(g0[y][x]) exp[(y+1)%10][(x+1)%10]=1;
ok('glider shifted diag', A.lfHash(g)===A.lfHash(exp));
// run + cycle detection
const r=A.lfRun(A.lfParse(BL).value, 10);
ok('cycle detected', r.cycle===true && r.period===2);
ok('still life period 1', A.lfRun(blk.value, 5).period===1);
// pattern errors
ok('pulsar too small error', A.lfPattern('pulsar', 10).error!==null);
ok('unknown pattern error', A.lfPattern('nope', 20).error!==null);
ok('pulsar cells 48', A.lfCount(A.lfPattern('pulsar', 20).value)===48);
// text roundtrip + svg
ok('text roundtrip', A.lfText(p.value)===BL);
ok('svg renders', A.lfSvg(p.value).indexOf('<svg')===0);
console.log('LifeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
