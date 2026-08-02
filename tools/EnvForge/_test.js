// EnvForge _test.js
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script>'); process.exit(1); }
let mod = { exports: {} };
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;

let pass=0, fail=0;
function ok(n,c){ if(c){pass++;console.log('PASS',n);} else {fail++;console.error('FAIL',n);} }

const parsed = P.parseEnv("A=1\nB=2\n# comment\nC=3");
ok('parse 3 keys', parsed.filter(e=>e.key).length===3);
ok('parse comment captured', parsed[2].comment==='comment');
ok('parse value C', P.getVar(parsed,'C')==='3');

const q = P.parseEnv('A="hello world"');
ok('parse quoted value', P.getVar(q,'A')==='hello world');

const ex = P.parseEnv('export K=V');
ok('parse export prefix', P.getVar(ex,'K')==='V');

ok('serialize round-trip', P.serializeEnv(P.parseEnv("A=1\nB=2"))==="A=1\nB=2");

const refs = P.resolveRefs(P.parseEnv("A=1\nB=${A}2"));
ok('resolve ${VAR}', P.getVar(refs,'B')==='12');

const d = P.diffEnv("A=1\nB=2\nC=3", "A=9\nB=2\nD=4");
ok('diff added', d.added.join(',')==='D');
ok('diff removed', d.removed.join(',')==='C');
ok('diff changed', d.changed.length===1 && d.changed[0].key==='A' && d.changed[0].a==='1' && d.changed[0].b==='9');

const v = P.validateEnv("A=1\nB=2", ['A','X']);
ok('validate missing reports X', v.ok===false && v.missing.join(',')==='X');
const v2 = P.validateEnv("A=1\nB=2", ['A','B']);
ok('validate ok when all present', v2.ok===true);

const json = P.toJSON(P.parseEnv("A=1\nB=2"));
ok('toJSON', json.A==='1' && json.B==='2');
ok('fromJSON round-trip', P.serializeEnv(P.fromJSON({A:'1',B:'2'}))==='A=1\nB=2');

console.log('\n'+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
