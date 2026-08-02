
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no script'); process.exit(1); }
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

const inc = 'tape: 1011\nstart: q0\naccept: qa\nreject: qr\nq0,1 -> q0,1,R\nq0,0 -> q0,0,R\nq0,_ -> q1,_,L\nq1,0 -> qa,1,L\nq1,1 -> q1,0,L\nq1,_ -> qa,1,L';
const p = P.tmParse(inc);
ok(p.start==='q0' && p.accept==='qa', 'parse meta');
const r = P.tmRun(p, {maxSteps:100});
ok(r.status==='accept', 'increment accepts');
ok(r.tape.replace(/^_+|_+$/g,'')==='1100', '1011+1 = 1100, got '+r.tape);
ok(r.steps>0, 'steps positive');

// halt without accept: keep moving right over 1s then no rule
const p2 = P.tmParse('tape: 11\nstart: q0\naccept: qa\nq0,1 -> q0,1,R');
const r2 = P.tmRun(p2, {maxSteps:50});
ok(r2.status==='halt', 'halt status');
ok(r2.accepted===false, 'not accepted');

// malformed rule throws
let threw=false;
try { P.tmParse('tape: 1\nstart: q0\nq0,1 -> bad'); } catch(e){ threw=true; }
ok(threw, 'malformed throws');

console.log('PASS '+n+' assertions');
