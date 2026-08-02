const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function near(a,b,e){ return Math.abs(a-b) <= (e==null?0.01:e); }

// ---- parseFlex ----
ok(JSON.stringify(P.parseFlex('none'))===JSON.stringify({grow:0,shrink:0,basis:'auto'}), 'parseFlex none');
ok(JSON.stringify(P.parseFlex('auto'))===JSON.stringify({grow:1,shrink:1,basis:'auto'}), 'parseFlex auto');
ok(JSON.stringify(P.parseFlex('initial'))===JSON.stringify({grow:0,shrink:1,basis:'auto'}), 'parseFlex initial');
ok(P.parseFlex('2').grow===2 && P.parseFlex('2').basis==='0%', 'parseFlex single number');
ok(P.parseFlex('2 3').shrink===3, 'parseFlex two numbers');
ok(P.parseFlex('1 1 200px').basis==='200px', 'parseFlex triple');
ok(P.parseFlex('1 200px').grow===1 && P.parseFlex('1 200px').basis==='200px', 'parseFlex grow+basis');
ok(P.parseFlex(3).grow===3, 'parseFlex numeric arg');
ok(P.parseFlex(null).grow===0, 'parseFlex null default');

// ---- resolveBasis ----
ok(P.resolveBasis('auto', 120, 600)===120, 'basis auto -> content');
ok(P.resolveBasis('50%', 120, 600)===300, 'basis percent');
ok(P.resolveBasis('160px', 120, 600)===160, 'basis px');
ok(P.resolveBasis(80, 120, 600)===80, 'basis number');

// ---- order ----
var ord=P.orderItems(P.normItems([{order:2,label:'a'},{order:-1,label:'b'},{order:0,label:'c'}]));
ok(ord.map(function(x){return x.label;}).join('')==='bca', 'order sorting');
var stable=P.orderItems(P.normItems([{label:'x'},{label:'y'},{label:'z'}]));
ok(stable.map(function(x){return x.label;}).join('')==='xyz', 'order stable when equal');

// ---- flexLine grow ----
var items=P.normItems([{flex:'1 1 0%',w:0},{flex:'1 1 0%',w:0}]);
var line={items:items, hyp:[0,0]};
var sz=P.flexLine(line, 600, 0);
ok(near(sz[0],300)&&near(sz[1],300), 'grow equal split');
var items2=P.normItems([{flex:'1 1 0%'},{flex:'2 1 0%'}]);
var sz2=P.flexLine({items:items2,hyp:[0,0]}, 300, 0);
ok(near(sz2[0],100)&&near(sz2[1],200), 'grow weighted 1:2');
var items3=P.normItems([{flex:'1 1 0%'},{flex:'1 1 0%'}]);
var sz3=P.flexLine({items:items3,hyp:[0,0]}, 620, 20);
ok(near(sz3[0],300)&&near(sz3[1],300), 'gap deducted before grow');

// ---- flexLine shrink ----
var sh=P.normItems([{flex:'0 1 400px'},{flex:'0 1 400px'}]);
var sz4=P.flexLine({items:sh,hyp:[400,400]}, 600, 0);
ok(near(sz4[0],300)&&near(sz4[1],300), 'shrink equal weight');
var sh2=P.normItems([{flex:'0 0 400px'},{flex:'0 0 400px'}]);
var sz5=P.flexLine({items:sh2,hyp:[400,400]}, 600, 0);
ok(near(sz5[0],400)&&near(sz5[1],400), 'shrink 0 does not shrink (overflow)');
var sh3=P.normItems([{flex:'0 1 200px'},{flex:'0 3 200px'}]);
var sz6=P.flexLine({items:sh3,hyp:[200,200]}, 300, 0);
ok(near(sz6[0],175)&&near(sz6[1],125), 'shrink weighted 1:3');

// ---- distribute ----
var d1=P.distribute('flex-start',100,3,0); ok(d1.start===0&&d1.between===0, 'justify flex-start');
var d2=P.distribute('flex-end',100,3,0); ok(d2.start===100, 'justify flex-end');
var d3=P.distribute('center',100,3,0); ok(d3.start===50, 'justify center');
var d4=P.distribute('space-between',100,3,0); ok(d4.start===0&&near(d4.between,50), 'justify space-between');
var d5=P.distribute('space-around',90,3,0); ok(near(d5.start,15)&&near(d5.between,30), 'justify space-around');
var d6=P.distribute('space-evenly',90,2,0); ok(near(d6.start,30)&&near(d6.between,30), 'justify space-evenly');
var d7=P.distribute('space-between',100,1,0); ok(d7.between===0, 'space-between single item');

// ---- breakLines ----
var bi=P.normItems([{w:180},{w:180},{w:180},{w:180}]);
var hyp=[180,180,180,180];
ok(P.breakLines(bi,hyp,600,0,'nowrap').length===1, 'nowrap single line');
var wl=P.breakLines(bi,hyp,600,0,'wrap');
ok(wl.length===2 && wl[0].items.length===3 && wl[1].items.length===1, 'wrap breaks at 3 per line');
var wl2=P.breakLines(bi,hyp,600,20,'wrap');
ok(wl2[0].items.length===3, 'wrap accounts for gap');
var exact=P.breakLines(P.normItems([{w:300},{w:300}]),[300,300],600,0,'wrap');
ok(exact.length===1, 'exact fit stays one line');

// ---- layout: row basics ----
var r1=P.layout({direction:'row',gap:0}, [{flex:'1 1 0%'},{flex:'1 1 0%'}], {w:600,h:100});
ok(r1.boxes[0].x===0 && r1.boxes[0].w===300 && r1.boxes[1].x===300, 'layout row equal');
ok(r1.boxes[0].h===100, 'align-items stretch fills cross');
var r2=P.layout({direction:'row',align:'flex-start'}, [{w:100,h:40}], {w:600,h:200});
ok(r2.boxes[0].h===40 && r2.boxes[0].y===0, 'align flex-start keeps natural height');
var r3=P.layout({direction:'row',align:'center'}, [{w:100,h:40}], {w:600,h:200});
ok(r3.boxes[0].y===80, 'align center');
var r4=P.layout({direction:'row',align:'flex-end'}, [{w:100,h:40}], {w:600,h:200});
ok(r4.boxes[0].y===160, 'align flex-end');
var r5=P.layout({direction:'row',justify:'space-between'}, [{w:100},{w:100}], {w:600,h:100});
ok(r5.boxes[0].x===0 && r5.boxes[1].x===500, 'justify space-between positions');
var r6=P.layout({direction:'row',justify:'center'}, [{w:100},{w:100}], {w:600,h:100});
ok(r6.boxes[0].x===200 && r6.boxes[1].x===300, 'justify center positions');

// ---- layout: reverse ----
var rv=P.layout({direction:'row-reverse'}, [{w:100},{w:100}], {w:600,h:100});
ok(rv.boxes[0].x===500 && rv.boxes[1].x===400, 'row-reverse mirrors');

// ---- layout: column ----
var c1=P.layout({direction:'column'}, [{w:100,h:50},{w:100,h:50}], {w:300,h:400});
ok(c1.boxes[0].y===0 && c1.boxes[1].y===50, 'column stacking');
ok(c1.boxes[0].w===300, 'column stretch cross = width');
var c2=P.layout({direction:'column',align:'center'}, [{w:100,h:50}], {w:300,h:400});
ok(c2.boxes[0].x===100, 'column align center on x');

// ---- layout: wrap ----
var wr=P.layout({direction:'row',wrap:'wrap',gap:0,alignContent:'flex-start'},
  [{w:200,h:50},{w:200,h:50},{w:200,h:50},{w:200,h:50}], {w:600,h:300});
ok(wr.lines===2, 'wrap produces 2 lines');
ok(wr.boxes[3].y===50, '4th item on second line');
var wrRev=P.layout({direction:'row',wrap:'wrap-reverse',alignContent:'flex-start'},
  [{w:400,h:50},{w:400,h:50}], {w:600,h:300});
ok(wrRev.boxes[0].y===50 && wrRev.boxes[1].y===0, 'wrap-reverse flips line order');

// ---- layout: gap ----
var g1=P.layout({direction:'row',gap:20}, [{w:100},{w:100}], {w:600,h:100});
ok(g1.boxes[1].x===120, 'gap applied between items');

// ---- layout: align-self ----
var as=P.layout({direction:'row',align:'flex-start'},
  [{w:100,h:40},{w:100,h:40,alignSelf:'flex-end'}], {w:600,h:200});
ok(as.boxes[0].y===0 && as.boxes[1].y===160, 'align-self overrides align-items');

// ---- layout: order affects position not index ----
var od=P.layout({direction:'row'}, [{w:100,order:1},{w:100,order:0}], {w:600,h:100});
ok(od.boxes[0].i===0 && od.boxes[1].i===1, 'output sorted by source index');
ok(od.boxes[1].x===0 && od.boxes[0].x===100, 'order moves item visually');

// ---- CSS generation ----
var css=P.containerCss({direction:'column',wrap:'wrap',justify:'center',align:'center',gap:12});
ok(css.indexOf('display: flex;')>=0, 'css has display flex');
ok(css.indexOf('flex-direction: column;')>=0, 'css direction');
ok(css.indexOf('gap: 12px;')>=0, 'css gap');
ok(P.containerCss({direction:'row'}).indexOf('flex-direction')<0, 'css omits default direction');
ok(P.containerCss({align:'stretch'}).indexOf('align-items')<0, 'css omits default align');
ok(P.containerCss({wrap:'nowrap',alignContent:'center'}).indexOf('align-content')<0, 'align-content skipped when nowrap');
ok(P.containerCss({wrap:'wrap',alignContent:'center'}).indexOf('align-content: center;')>=0, 'align-content kept when wrap');
var ic=P.itemCss({flex:'1 1 0%'},'.a');
ok(ic.indexOf('.a {')===0 && ic.indexOf('flex: 1 1 0%;')>=0, 'itemCss selector + flex');
ok(P.itemCss({flex:'1',alignSelf:'center',order:2}).indexOf('order: 2;')>=0, 'itemCss order');
var full=P.fullCss({gap:8},[{flex:'1 1 0%'},{}]);
ok(full.indexOf('.item-1')>=0, 'fullCss emits non-default item rule');
ok(full.indexOf('.item-2')<0, 'fullCss skips default item');

// ---- lint ----
var l1=P.lint({wrap:'nowrap'}, [{flex:'0 0 400px'},{flex:'0 0 400px'}], {w:600,h:200});
ok(l1.some(function(x){return x.level==='error';}), 'lint detects hard overflow');
var l2=P.lint({wrap:'nowrap',alignContent:'center'}, [{}], {w:600,h:200});
ok(l2.some(function(x){return x.msg.indexOf('align-content')>=0;}), 'lint align-content noop');
var l3=P.lint({justify:'space-between'}, [{}], {w:600,h:200});
ok(l3.some(function(x){return x.msg.indexOf('space-between')>=0;}), 'lint single-item justify');
var l4=P.lint({wrap:'wrap',gap:16}, [{flex:'0 0 50%'},{flex:'0 0 50%'}], {w:600,h:200});
ok(l4.some(function(x){return x.msg.indexOf('calc')>=0;}), 'lint percent basis + gap');
var l5=P.lint({}, [{order:1}], {w:600,h:200});
ok(l5.some(function(x){return x.msg.indexOf('order')>=0;}), 'lint order a11y note');
ok(P.lint({wrap:'wrap',gap:0}, [{w:100},{w:100}], {w:600,h:200}).length===0, 'clean config has no findings');

// ---- robustness ----
ok(P.layout({}, [], {w:600,h:100}).boxes.length===0, 'empty items safe');
ok(P.layout({}, [{}], {w:0,h:0}).boxes.length===1, 'zero-size container safe');
var shrinkZero=P.layout({direction:'row',wrap:'nowrap'},[{flex:'0 1 1000px'}],{w:100,h:50});
ok(shrinkZero.boxes[0].w===100, 'single item shrinks to container');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
