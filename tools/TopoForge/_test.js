const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var p=A.parseEdges('a -> b\nb -> c');
ok('parse nodes', p.nodes.length===3 && p.edges.length===2);
ok('parse arrow alt', A.parseEdges('a => b').edges.length===1);
ok('parse bad line', A.parseEdges('nonsense').error!==null);
ok('parse empty ok', A.parseEdges('').nodes.length===0);
var r=A.topoSort(['a','b','c'],[['a','b'],['b','c']]);
ok('linear order', JSON.stringify(r.order)==='["a","b","c"]' && r.cycle===null);
var d=A.topoSort(['a','b','c','d'],[['a','b'],['a','c'],['b','d'],['c','d']]);
ok('diamond valid', d.order[0]==='a' && d.order[3]==='d');
var cy=A.topoSort(['a','b'],[['a','b'],['b','a']]);
ok('cycle detected', cy.order===null && cy.cycle.length===2);
var sl=A.topoSort(['a'],[['a','a']]);
ok('self-loop cycle', sl.order===null && sl.cycle.indexOf('a')>=0);
ok('isolated nodes', A.topoSort(['x','y'],[]).order.length===2);
var lv=A.levels(['a','b','c','d'],[['a','b'],['a','c'],['b','d'],['c','d']]);
ok('levels count', lv.length===3);
ok('levels parallel', JSON.stringify(lv[1])==='["b","c"]');
ok('levels cycle null', A.levels(['a','b'],[['a','b'],['b','a']])===null);
console.log('TopoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
