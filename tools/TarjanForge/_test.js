const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function norm(sccs){ return sccs.map(function(s){return s.join(',');}).sort(); }
var g1=[['a','b'],['b','c'],['c','a'],['b','d'],['d','e'],['e','d']];
var r1=norm(A.tarjanScc(g1));
ok('two nontrivial sccs', JSON.stringify(r1)==='["a,b,c","d,e"]');
var g2=[['a','b'],['b','c']];
ok('dag all singleton', A.tarjanScc(g2).every(function(s){return s.length===1;}));
ok('dag scc count', A.tarjanScc(g2).length===3);
var g3=[['x','x']];
ok('self loop single scc', A.tarjanScc(g3).length===1);
ok('self loop has cycle', A.sccHasCycle(g3)===true);
ok('dag no cycle', A.sccHasCycle(g2)===false);
ok('cycle detected', A.sccHasCycle(g1)===true);
var c=A.sccCondense(g1);
ok('condense comp count', c.sccs.length===2);
ok('condense dag edges 1', c.dagEdges.length===1);
ok('compOf same comp', c.compOf['a']===c.compOf['b'] && c.compOf['b']===c.compOf['c']);
ok('compOf diff comp', c.compOf['a']!==c.compOf['d']);
var big=[]; for(var i=0;i<50;i++) big.push(['n'+i,'n'+((i+1)%50)]);
ok('big ring one scc', A.tarjanScc(big).length===1 && A.tarjanScc(big)[0].length===50);
var pe=A.parseEdges('a->b\nb->c');
ok('parse ok', pe.error===null && pe.value.length===2);
ok('parse bad line', A.parseEdges('a-b').error!==null);
ok('empty graph', A.tarjanScc([]).length===0);
console.log('TarjanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
