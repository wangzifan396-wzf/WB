
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var corpus = 'low low low low lower lower lowest newest newest newest';
var m1 = P.tkTrain(corpus, 6), m2 = P.tkTrain(corpus, 6);
ok(JSON.stringify(m1) === JSON.stringify(m2), 'deterministic training');
ok(m1.length > 0 && m1.length <= 6, 'merge count bounded');
var enc = P.tkEncodeWord('lowest', m1);
ok(enc.join('') === 'lowest', 'tokens rejoin to word');
ok(enc.length < 6, 'subword compression happened');
var raw = P.tkEncodeWord('zzz', m1);
ok(raw.length === 3, 'unseen chars stay split');
var mw = P.tkMergeWord(['a','b','a','b'],'a','b');
ok(JSON.stringify(mw) === '["ab","ab"]', 'merge all occurrences');
var bp = P.tkBestPair({'a\u0001b':3,'b\u0001c':3});
ok(bp.pair[0] === 'a' && bp.pair[1] === 'b', 'tie broken lexicographically');
var multi = P.tkEncode('low lowest', m1);
ok(multi.length === 2, 'multi word encode');
console.log('PASS '+n+' assertions');
