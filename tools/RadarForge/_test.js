const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

const d=P.parseData('轴: A, B, C\nX: 1, 2, 3\nY: 3, 2, 1');
ok(d.axes.join(',')==='A,B,C', 'axis line parsed');
ok(d.series.length===2, 'two series parsed');
ok(d.series[0].values.join(',')==='1,2,3', 'series values parsed');
ok(d.errors.length===0, 'clean input has no errors');
const noAxis=P.parseData('X: 5, 6');
ok(noAxis.axes.join(',')==='指标1,指标2', 'axes auto-generated when absent');
const short=P.parseData('轴: A, B, C\nX: 1');
ok(short.series[0].values.join(',')==='1,0,0', 'short series padded with zeros');
const long=P.parseData('轴: A\nX: 1, 2');
ok(long.series[0].values.length===1 && long.errors.length===1, 'over-long series truncated with a warning');
ok(P.parseData('no colon here').errors.length===1, 'line without colon reported');
ok(P.parseData('X: a, b').errors.length===1, 'non numeric values reported');
ok(P.parseData('轴：甲，乙\nX：1，2').axes.length===2, 'full-width punctuation supported');

ok(P.maxValue(d.series,0)===3, 'maxValue scans all series');
ok(P.maxValue([],0)===1, 'maxValue falls back to one');
ok(P.maxValue(d.series,10)===10, 'maxValue respects an explicit floor');

ok(Math.abs(P.axisAngle(0,4)+Math.PI/2)<1e-9, 'first axis points straight up');
ok(Math.abs(P.axisAngle(1,4)-0)<1e-9, 'second axis of four points right');
const pp=P.polarPoint(100,100,50,0);
ok(Math.abs(pp.x-150)<1e-9 && Math.abs(pp.y-100)<1e-9, 'polarPoint maps zero angle to the right');

const pts=P.polygonPoints([10,10,10,10],{cx:100,cy:100,r:50,max:10});
ok(pts.length===4, 'one point per value');
ok(Math.abs(pts[0].y-50)<0.01, 'full value reaches the outer radius');
const clamp=P.polygonPoints([20],{cx:0,cy:0,r:10,max:10});
ok(Math.abs(clamp[0].y+10)<0.01, 'values above max clamp to the radius');
const zero=P.polygonPoints([0,0,0],{cx:5,cy:5,r:50,max:10});
ok(Math.abs(zero[0].x-5)<0.01 && Math.abs(zero[0].y-5)<0.01, 'zero values collapse to the centre');

const sq=P.polygonArea([{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}]);
ok(sq===100, 'square area computed');
ok(P.polygonArea([{x:0,y:0},{x:1,y:1}])===0, 'degenerate polygon has zero area');

const st=P.seriesStats({name:'X',values:[1,2,3]},['A','B','C']);
ok(st.mean===2 && st.max===3 && st.min===1, 'series stats basics');
ok(st.strongest==='C' && st.weakest==='A', 'strongest and weakest axis identified');
ok(st.sd>0.8 && st.sd<0.83, 'population standard deviation computed');
const even=P.seriesStats({name:'E',values:[5,5,5]},['A','B','C']);
ok(even.cv===0 && even.balance===100, 'perfectly even series is fully balanced');
ok(P.seriesStats({name:'Z',values:[]},[]).mean===0, 'empty series does not crash');

const cmp=P.compare(d);
ok(cmp.length===3, 'compare yields one row per axis');
ok(cmp[0].best==='Y' && cmp[0].worst==='X', 'per-axis best and worst identified');
ok(cmp[0].spread===2, 'per-axis spread computed');
ok(P.compare(P.parseData('X: 1, 2')).length===2, 'compare works with a single series');

const lay=P.layout(d,{size:300});
ok(lay.empty===false, 'layout produced');
ok(lay.axes.length===3 && lay.shapes.length===2, 'layout carries axes and shapes');
ok(lay.rings.length===4, 'four grid rings by default');
ok(lay.shapes[0].coverage>0 && lay.shapes[0].coverage<=100, 'coverage percentage within range');
ok(lay.shapes[0].color!==lay.shapes[1].color, 'series get distinct colours');
ok(P.layout({axes:[],series:[]},{}).empty===true, 'empty data yields empty layout');

const svg=P.toSvg(lay);
ok(svg.indexOf('<svg')===0, 'svg output starts with svg tag');
ok(svg.indexOf('viewBox="0 0 300 300"')>0, 'svg carries the layout viewBox');
ok((svg.match(/<polygon/g)||[]).length===6, 'four rings plus two series polygons');
ok(svg.indexOf('<circle')>0, 'vertex markers drawn');
ok(P.toSvg(P.layout({axes:[],series:[]},{})).indexOf('<svg')===0, 'empty layout still yields valid svg');
ok(P.toSvg(P.layout(P.parseData('轴: <a>\nX: 1'),{})).indexOf('&lt;a&gt;')>0, 'axis labels are xml-escaped');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
