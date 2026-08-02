const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

ok(P.parseRange('1.2.3').kind==='exact' && P.parseRange('1.2.3').risk===0, 'exact version is zero risk');
ok(P.parseRange('^1.2.3').kind==='caret', 'caret range detected');
ok(P.parseRange('^0.4.0').kind==='caret0', 'caret on 0.x treated separately');
ok(P.parseRange('~1.2.3').kind==='tilde', 'tilde range detected');
ok(P.parseRange('*').risk===3, 'wildcard is highest risk');
ok(P.parseRange('git+https://x/y.git').kind==='git', 'git dependency detected');
ok(P.parseRange('file:../local').kind==='file', 'file dependency detected');
ok(P.parseRange('workspace:*').kind==='workspace', 'workspace protocol detected');
ok(P.parseRange('>=1 <2').kind==='range', 'comparator range detected');
ok(P.parseRange('').kind==='empty', 'empty range detected');

const pkg=P.parsePackageJson('{"name":"a","version":"1.0.0","dependencies":{"x":"^1.0.0","y":"*"},"devDependencies":{"x":"^1.0.0"}}');
ok(pkg.ok===true, 'valid package.json parses');
ok(pkg.deps.length===3, 'deps flattened across groups');
ok(pkg.dupes.length===1 && pkg.dupes[0].name==='x', 'duplicate across scopes detected');
ok(P.parsePackageJson('{bad').ok===false, 'broken json reports failure');
ok(P.parsePackageJson('[]').ok===true || P.parsePackageJson('[]').deps.length===0, 'array input yields no deps');

const rep=P.depReport(pkg);
ok(rep.total===3, 'report counts all deps');
ok(rep.issues.some(function(i){return /y/.test(i.msg);}), 'wildcard dep raised as issue');
ok(rep.score<100, 'wildcard and duplicate lower the score');
const clean=P.depReport(P.parsePackageJson('{"packageManager":"pnpm@9","dependencies":{"a":"1.0.0"}}'));
ok(clean.score>rep.score, 'pinned deps score higher');

const pg=P.parseGraph('a -> b, c\nb -> c\n# comment\nbad line');
ok(pg.edges.length===3, 'graph edges parsed');
ok(pg.errors.length===1, 'malformed line reported');
const g=P.buildGraph(pg.edges);
ok(g.names.join(',')==='a,b,c', 'nodes collected and sorted');
ok(g.indeg.c===2, 'in-degree counted');
ok(g.adj.a.length===2, 'adjacency built');

const cyc=P.findCycles(P.buildGraph(P.parseGraph('a -> b\nb -> c\nc -> a').edges));
ok(cyc.length===1 && cyc[0].length===4, 'three-node cycle detected');
ok(P.findCycles(P.buildGraph(P.parseGraph('a -> b\nb -> c').edges)).length===0, 'acyclic graph reports no cycles');
ok(P.findCycles(P.buildGraph(P.parseGraph('a -> a').edges)).length===1, 'self loop detected');

const topo=P.topoOrder(P.buildGraph(P.parseGraph('a -> b\nb -> c').edges));
ok(topo.complete===true && topo.order.join(',')==='a,b,c', 'topological order computed');
ok(P.topoOrder(P.buildGraph(P.parseGraph('a -> b\nb -> a').edges)).complete===false, 'cyclic graph is not fully sortable');

const d=P.depths(P.buildGraph(P.parseGraph('a -> b\nb -> c').edges));
ok(d.a===2 && d.c===0, 'longest path depth computed');
ok(P.depths(P.buildGraph(P.parseGraph('a -> b\nb -> a').edges)).a>=1, 'cyclic depth terminates');

const mt=P.metrics(P.buildGraph(P.parseGraph('a -> b, c\nb -> c').edges));
ok(mt.nodes===3 && mt.edges===3, 'metrics count nodes and edges');
ok(mt.rows[0].name==='c' && mt.rows[0].fanIn===2, 'most-depended module ranks first');
ok(mt.leaves===1 && mt.roots===1, 'leaves and roots counted');

const an=P.analyze('a -> b\nb -> a');
ok(an.cycles.length===1 && an.health<100, 'analyze penalises cycles');
ok(P.analyze('a -> b\nb -> c').health===100, 'clean chain is fully healthy');
const dot=P.dotOutput(an.graph, an.cycles);
ok(dot.indexOf('digraph deps {')===0, 'DOT output starts with digraph');
ok(dot.indexOf('color=red')>0, 'cycle nodes highlighted in DOT');
ok(dot.indexOf('"a" -> "b";')>0, 'DOT contains edges');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
