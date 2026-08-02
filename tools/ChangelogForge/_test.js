const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var pf=A.parseLine('feat(api): add X');
ok('parse feat type', pf && pf.type==='feat');
ok('parse feat scope', pf && pf.scope==='api');
ok('parse feat subject', pf && pf.subject==='add X');
var pfb=A.parseLine('fix!: drop support');
ok('parse fix bang breaking', pfb && pfb.breaking===true && pfb.type==='fix');
ok('parse invalid null', A.parseLine('not a commit')===null);
var text='feat: a\nfix: b\nfeat!: c';
ok('bump major', A.bump(A.parse(text))==='major');
ok('bump minor', A.bump(A.parse('feat: a\nfeat: b'))==='minor');
ok('bump patch', A.bump(A.parse('fix: a'))==='patch');
ok('bump none', A.bump(A.parse('chore: a'))==='none');
ok('next minor', A.nextVersion('1.2.3','minor')==='1.3.0');
ok('next major', A.nextVersion('1.2.3','major')==='2.0.0');
ok('next patch', A.nextVersion('1.2.3','patch')==='1.2.4');
var bc=A.parse('feat: x\nBREAKING CHANGE: removed y');
ok('breaking via body len', bc.length===1 && bc[0].breaking===true);
ok('bump major bc', A.bump(bc)==='major');
ok('changelog features', A.changelog('feat: add X\nfix: kill bug',{version:'1.1.0'}).indexOf('### Features')>=0);
ok('changelog fix', A.changelog('fix: bug').indexOf('Bug Fixes')>=0);
console.log('ChangelogForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
