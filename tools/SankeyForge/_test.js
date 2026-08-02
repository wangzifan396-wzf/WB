const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

const p=P.parseFlows('A -> B: 10\nB -> C: 4\n# note\nbroken\nA -> A: 3\nA -> B: -1');
ok(p.links.length===2, 'valid flow lines parsed');
ok(p.errors.length===3, 'malformed, self-loop and negative rows rejected');
ok(p.errors.some(function(e){return /自环/.test(e.why);}), 'self loop reason reported');
ok(p.errors.some(function(e){return /正数/.test(e.why);}), 'negative value reason reported');
ok(P.parseFlows('A => B [7]').links[0].value===7, 'bracket syntax and arrow alias supported');
ok(P.parseFlows('甲 → 乙: 2.5').links[0].value===2.5, 'unicode arrow and decimals supported');

const merged=P.mergeLinks([{from:'A',to:'B',value:1},{from:'A',to:'B',value:2},{from:'A',to:'C',value:5}]);
ok(merged.length===2, 'duplicate edges merged');
ok(merged[0].value===3, 'merged edge sums values');
ok(P.nodeList(merged).join(',')==='A,B,C', 'node list collected in first-seen order');

const la=P.assignLayers([{from:'A',to:'B',value:1},{from:'B',to:'C',value:1}]);
ok(la.layer.A===0 && la.layer.B===1 && la.layer.C===2, 'chain layered by longest path');
ok(la.maxLayer===2, 'max layer computed');
ok(la.cyclic===false, 'acyclic input not flagged');
const cy=P.assignLayers([{from:'A',to:'B',value:1},{from:'B',to:'A',value:1}]);
ok(cy.cyclic===true, 'cycle detected during layering');
const sk=P.assignLayers([{from:'A',to:'B',value:1},{from:'A',to:'C',value:1},{from:'C',to:'D',value:1}]);
ok(sk.layer.B===sk.maxLayer, 'terminal nodes pushed to last layer');

const tot=P.nodeTotals([{from:'A',to:'B',value:3},{from:'C',to:'B',value:2},{from:'B',to:'D',value:5}]);
ok(tot.B.inSum===5 && tot.B.outSum===5, 'node in/out sums accumulated');
ok(tot.B.value===5, 'node value is max of in and out');
ok(tot.A.inSum===0, 'source has zero inflow');

const bal=P.balanceCheck([{from:'A',to:'B',value:10},{from:'B',to:'C',value:4}]);
ok(bal.length===1 && bal[0].name==='B', 'unbalanced middle node reported');
ok(bal[0].delta===-6, 'balance delta computed as out minus in');
ok(P.balanceCheck([{from:'A',to:'B',value:2},{from:'B',to:'C',value:2}]).length===0, 'balanced graph reports nothing');

const lay=P.layout([{from:'A',to:'B',value:10},{from:'A',to:'C',value:5}], {width:600,height:300});
ok(lay.empty===false && lay.nodes.length===3, 'layout produces all nodes');
ok(lay.ribbons.length===2, 'layout produces one ribbon per link');
ok(lay.nodes[0].x < lay.nodes[lay.nodes.length-1].x || lay.maxLayer===1, 'layers spread horizontally');
ok(lay.ribbons[0].thickness>lay.ribbons[1].thickness, 'thicker ribbon for larger flow');
ok(P.layout([], {}).empty===true, 'empty input yields empty layout');
const stacked=P.layout([{from:'A',to:'C',value:1},{from:'B',to:'C',value:1}], {width:600,height:300});
ok(stacked.ribbons[0].y1!==stacked.ribbons[1].y1, 'ribbons stack at shared target');

const rp=P.ribbonPath({x0:0,y0:0,x1:100,y1:50,thickness:10});
ok(rp.charAt(0)==='M' && rp.slice(-1)==='Z', 'ribbon path is a closed shape');
ok(rp.indexOf(' C')>0, 'ribbon path uses cubic curves');

const svg=P.toSvg(lay);
ok(svg.indexOf('<svg')===0, 'svg output starts with svg tag');
ok(svg.indexOf('viewBox="0 0 600 300"')>0, 'svg carries viewBox from layout');
ok((svg.match(/<rect/g)||[]).length===4, 'svg draws background plus three nodes');
ok(svg.indexOf('<title>')>0, 'svg includes accessible titles');
ok(P.toSvg(P.layout([],{})).indexOf('<svg')===0, 'empty layout still yields valid svg');
ok(P.toSvg(P.layout([{from:'<x>',to:'B',value:1}],{})).indexOf('&lt;x&gt;')>0, 'node labels are xml-escaped');

const s=P.summary([{from:'A',to:'B',value:10},{from:'B',to:'C',value:6},{from:'B',to:'D',value:4}]);
ok(s.nodes===4 && s.links===3, 'summary counts nodes and links');
ok(s.sources.join(',')==='A' && s.sinks.join(',')==='C,D', 'summary identifies sources and sinks');
ok(s.throughput===10, 'summary throughput equals source outflow');
ok(s.biggest.value===10, 'summary reports biggest flow');
ok(s.layers===3, 'summary counts layers');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
