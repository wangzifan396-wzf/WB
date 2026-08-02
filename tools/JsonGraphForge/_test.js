
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var obj={a:1,b:{c:2,d:[3,4]}, e:'x'};
var g=P.jgGraph(obj);
ok(g.nodes.length===8, '8 nodes (root+a+b+c+d+array+2elems+e), got '+g.nodes.length);
ok(g.edges.length===7, '7 edges, got '+g.edges.length);
var svg=P.jgSvg(g, 560, 360);
ok(/<svg/.test(svg) && /<rect/.test(svg), 'svg has nodes');
ok(g.nodes.filter(function(n){return n.type==='array';}).length===1, 'array typed');
ok(P.jgGraph(P.jgParse('[1,2,3]')).nodes.length===4, 'array root 4 nodes');
console.log('PASS '+n+' assertions');
