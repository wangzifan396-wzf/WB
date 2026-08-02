const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

const p=P.parseSeries('起始 100\n增 +20\n减 -5\n小计 =\n# note\n乱码行');
ok(p.items.length===4, 'four valid rows parsed');
ok(p.items[0].type==='start' && p.items[0].value===100, 'first unsigned number is the start value');
ok(p.items[1].type==='delta' && p.items[1].value===20, 'signed positive parsed as delta');
ok(p.items[2].value===-5, 'signed negative parsed as delta');
ok(p.items[3].type==='subtotal', 'equals sign marks a subtotal');
ok(p.errors.length===1, 'unparsable row reported');
ok(P.parseSeries('a 1,234').items[0].value===1234, 'thousands separators tolerated');
ok(P.parseSeries('第二锚点 100\n锚 250').items[1].type==='absolute', 'later unsigned number is an absolute anchor');

const c=P.compute(p.items);
ok(c.rows.length===4, 'compute returns one row per item');
ok(c.rows[0].end===100, 'start row ends at its value');
ok(c.rows[1].start===100 && c.rows[1].end===120, 'delta row bridges from previous total');
ok(c.rows[2].end===115, 'negative delta lowers the running total');
ok(c.rows[3].type==='subtotal' && c.rows[3].end===115, 'subtotal pillar reflects running total');
ok(c.total===115, 'compute reports final total');
const abs=P.compute(P.parseSeries('a 100\nb 250').items);
ok(abs.rows[1].delta===150, 'absolute anchor derives implied delta');
ok(P.compute([]).rows.length===0, 'empty input yields no rows');

const a=P.analyze(c.rows);
ok(a.start===100 && a.end===115, 'analyze reads start and end');
ok(a.net===15, 'net change computed');
ok(a.pct===15, 'percentage change computed against start');
ok(a.gain===20 && a.loss===-5, 'gains and losses split');
ok(a.biggestUp.label==='增', 'largest increase identified');
ok(a.biggestDown.label==='减', 'largest decrease identified');
ok(a.contributions.length===2, 'contributions exclude start and subtotal');
ok(a.contributions[0].label==='增', 'contributions sorted by magnitude');
ok(P.analyze([]).pct===null, 'percentage null when no start value');

ok(P.niceStep(100,5)===20, 'nice step for range 100');
ok(P.niceStep(9,5)===2, 'nice step rounds up to 2');
ok(P.niceStep(0,5)===1, 'nice step guards zero range');
ok(P.fmtNum(15000)==='1.5万', 'ten-thousands formatted');
ok(P.fmtNum(250000000)==='2.5亿', 'hundred-millions formatted');
ok(P.fmtNum(12.345)==='12.35', 'small numbers rounded to two decimals');

const lay=P.layout(c.rows, {width:600,height:300});
ok(lay.empty===false && lay.bars.length===4, 'layout produces one bar per row');
ok(lay.bars[1].color==='#EF4444', 'increase bar is red for the china convention');
ok(lay.bars[2].color==='#10B981', 'decrease bar is green for the china convention');
ok(lay.bars[0].color==='#5E6AD2', 'start pillar uses the accent colour');
ok(lay.bars[0].cx < lay.bars[3].cx, 'bars advance left to right');
ok(lay.ticks.length>=2, 'axis ticks generated');
ok(P.layout([],{}).empty===true, 'empty rows yield empty layout');
const flat=P.layout(P.compute(P.parseSeries('a 5\nb +0').items).rows,{});
ok(flat.bars.length===2, 'zero delta still renders a bar');

const svg=P.toSvg(lay);
ok(svg.indexOf('<svg')===0, 'svg output starts with svg tag');
ok(svg.indexOf('viewBox="0 0 600 300"')>0, 'svg carries the layout viewBox');
ok(svg.indexOf('stroke-dasharray')>0, 'connector lines drawn between bars');
ok(svg.indexOf('<title>')>0, 'bars carry accessible titles');
ok(P.toSvg(P.layout([],{})).indexOf('<svg')===0, 'empty layout still yields valid svg');
ok(P.toSvg(P.layout(P.compute(P.parseSeries('<b> 1').items).rows,{})).indexOf('&lt;b&gt;')>0, 'labels are xml-escaped');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
