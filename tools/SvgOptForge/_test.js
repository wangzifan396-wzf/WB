
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.svStripComments('a<!-- c -->b')==='ab','strip comment');
ok(P.svStripComments('x<!--\n multi\n-->y')==='xy','strip multiline comment');
ok(P.svRoundNums('1.2345')==='1.23','round 4->2');
ok(P.svRoundNums('1.5')==='1.5','keep 1.5');
ok(P.svRoundNums('-2.98765')==='-2.99','round negative');
ok(P.svRoundNums('rgb(0.11111,0.22222,0.33333)')==='rgb(0.11,0.22,0.33)','round rgb');
ok(P.svCollapse('a  b')==='a b','collapse spaces');
ok(P.svCollapse('a   b')==='a b','collapse triple');
var big='<svg>   <rect x="1.123456" />   </svg>';
var opt=P.svOptimize(big);
ok(opt.indexOf('1.12')>=0,'optimize rounds');
ok(opt.indexOf('  ')<0,'optimize no double space');
ok(opt.indexOf('<!--')<0,'optimize strips comment');
var st=P.svStats('aaaaaaaaaa','aa');
ok(st.saved===80,'saved pct');
ok(P.svOptimize('')==='','optimize empty');
ok(P.svOptimize('<path d="M 0.123456 0.987654 L 1.555555 2"/>').indexOf('0.12')>=0,'path round');
console.log('PASS '+n+' assertions');
