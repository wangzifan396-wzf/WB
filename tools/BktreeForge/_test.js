const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('lev base', A.bkLevenshtein('kitten','sitting')===3);
var t=A.bkBuild(['book','books','boo','cake','cape','cart']);
ok('size', t.size===6);
ok('dup not added', A.bkAdd(t,'book').size===6);
ok('empty word ignored', A.bkAdd(t,'').size===6);
// search book maxDist 1 -> book(0), books(1), boo(1)
var r=A.bkSearch(t,'book',1);
ok('search count', r.length===3);
ok('search exact first', r[0].word==='book' && r[0].dist===0);
ok('search sorted', r[1].dist===1 && r[2].dist===1);
ok('search members', r.map(x=>x.word).sort().join(',')==='boo,book,books');
// search cape maxDist 1 -> cape(0), cake(1); cart is dist 2
var r2=A.bkSearch(t,'cape',1);
ok('cape neighbors', r2.map(x=>x.word).join(',')==='cape,cake');
// maxDist 0 = exact
ok('exact only', A.bkSearch(t,'cake',0).length===1);
ok('miss', A.bkSearch(t,'zzzz',1).length===0);
// empty tree
ok('empty tree search', A.bkSearch(A.bkCreate(),'x',5).length===0);
ok('depth positive', A.bkDepth(t)>=2);
// larger stress: all words within distance found (brute-force cross-check)
var words=['apple','apply','ample','maple','staple','grape','grade','trade','tirade','spade'];
var big=A.bkBuild(words);
var got=A.bkSearch(big,'grape',2).map(x=>x.word).sort();
var brute=words.filter(w=>A.bkLevenshtein('grape',w)<=2).sort();
ok('matches brute force', JSON.stringify(got)===JSON.stringify(brute));
console.log('BktreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
