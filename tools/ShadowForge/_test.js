const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function near(a,b,e){ return Math.abs(a-b) <= (e==null?0.01:e); }

// ---- color ----
var c1=P.hexToRgb('#5E6AD2');
ok(c1.r===94 && c1.g===106 && c1.b===210, 'hexToRgb 6-digit');
var c2=P.hexToRgb('#fff');
ok(c2.r===255 && c2.g===255 && c2.b===255, 'hexToRgb 3-digit');
var c3=P.hexToRgb('#00000080');
ok(c3.r===0 && near(c3.a,0.502,0.002), 'hexToRgb 8-digit alpha');
ok(P.hexToRgb('black').r===0 && P.hexToRgb('white').r===255, 'named colors');
ok(P.hexToRgb('transparent').a===0, 'transparent alpha 0');
ok(P.rgbToHex({r:94,g:106,b:210})==='#5e6ad2', 'rgbToHex');
ok(P.rgbToHex({r:-5,g:300,b:0})==='#00ff00', 'rgbToHex clamps');
ok(P.rgbaStr('#000000',0.12)==='rgba(0, 0, 0, 0.12)', 'rgbaStr');
ok(P.rgbaStr('#ffffff',1.5)==='rgba(255, 255, 255, 1)', 'rgbaStr clamps alpha');

// ---- fmt ----
ok(P.fmt(2)==='2' && P.fmt(2.5)==='2.5' && P.fmt(2.004)==='2', 'fmt trims');

// ---- layerCss ----
ok(P.layerCss({x:0,y:1,blur:2,spread:0,alpha:0.12})==='0px 1px 2px 0px rgba(0, 0, 0, 0.12)', 'box layer css');
ok(P.layerCss({x:0,y:1,blur:2,spread:3,alpha:0.1,inset:true}).indexOf('inset ')===0, 'inset prefix');
ok(P.layerCss({x:0,y:1,blur:2,spread:9,alpha:0.1},'text')==='0px 1px 2px rgba(0, 0, 0, 0.1)', 'text layer drops spread');
ok(P.layerCss({x:0,y:2,blur:4,alpha:0.2},'drop').indexOf('drop-shadow(')===0, 'drop layer wraps');

// ---- shadowCss ----
ok(P.shadowCss([],'box')==='none', 'empty -> none');
var two=[{y:1,blur:2,alpha:0.1},{y:4,blur:8,alpha:0.1}];
ok((P.shadowCss(two,'box').match(/rgba\(/g)||[]).length===2, 'two layers joined by comma');
ok(P.shadowCss(two,'box',true).indexOf(',\n    ')>0, 'multiline join');
ok(/\)\s+drop-shadow/.test(P.shadowCss(two,'drop')), 'drop-shadow joined by space');
ok(P.propertyName('box')==='box-shadow' && P.propertyName('text')==='text-shadow' && P.propertyName('drop')==='filter', 'property names');
var rule=P.cssRule('.btn',two,'box');
ok(rule.indexOf('.btn {')===0 && rule.indexOf('box-shadow:')>0 && rule.trim().slice(-1)==='}', 'cssRule shape');

// ---- splitTop ----
ok(P.splitTop('a, b').length===2, 'splitTop basic');
ok(P.splitTop('0 1px rgba(0,0,0,.1), 0 2px rgba(0,0,0,.2)').length===2, 'splitTop ignores commas in parens');
ok(P.splitTop('   ').length===0, 'splitTop empty');

// ---- parseShadow ----
var p1=P.parseShadow('0 1px 2px 0 rgba(0, 0, 0, 0.12)');
ok(p1.length===1 && p1[0].y===1 && p1[0].blur===2 && near(p1[0].alpha,0.12), 'parse single');
var p2=P.parseShadow('0 1px 2px rgba(0,0,0,.08), inset 0 2px 4px 1px rgba(0,0,0,.2)');
ok(p2.length===2 && p2[1].inset===true && p2[1].spread===1, 'parse two + inset');
var p3=P.parseShadow('box-shadow: 0 4px 8px #5E6AD2;');
ok(p3.length===1 && p3[0].color==='#5e6ad2', 'parse strips property and semicolon');
ok(P.parseShadow('none').length===0, 'parse none');
ok(P.parseShadow('').length===0, 'parse empty');
ok(P.parseShadow(null).length===0, 'parse null');
var p4=P.parseShadow('drop-shadow(0 2px 4px rgba(0,0,0,.3)) drop-shadow(0 8px 16px rgba(0,0,0,.2))');
ok(p4.length===2 && p4[1].blur===16, 'parse multiple drop-shadow');
var p5=P.parseShadow('0 -3px 6px -2px rgba(0,0,0,.25)');
ok(p5[0].y===-3 && p5[0].spread===-2, 'parse negative numbers');
var p6=P.parseShadow('2px 2px 0 black');
ok(p6[0].color==='#000000' && p6[0].blur===0, 'parse named color');

// ---- round trip ----
var rt=[{x:0,y:2,blur:6,spread:-1,color:'#5e6ad2',alpha:0.25,inset:false},
        {x:1,y:-3,blur:0,spread:2,color:'#000000',alpha:0.1,inset:true}];
var css=P.shadowCss(rt,'box');
var back=P.parseShadow(css);
ok(back.length===2, 'round trip layer count');
ok(P.shadowCss(back,'box')===css, 'round trip css identical');
ok(back[1].inset===true && back[1].y===-3, 'round trip preserves inset + negative');
ok(back[0].color==='#5e6ad2', 'round trip preserves color');

// ---- smoothRamp ----
var sr=P.smoothRamp({layers:4, y:40, blur:80, alpha:0.2, curve:2});
ok(sr.length===4, 'ramp layer count');
ok(sr[3].y===40 && sr[3].blur===80, 'ramp last layer hits target');
ok(sr[0].y < sr[1].y && sr[1].y < sr[2].y, 'ramp increases monotonically');
ok(near(P.totalAlpha(sr), 0.2, 0.005), 'ramp total alpha matches request');
ok(P.smoothRamp({layers:0}).length===1, 'ramp min 1 layer');
var lin=P.smoothRamp({layers:4, y:40, curve:1});
ok(lin[0].y===10 && lin[1].y===20, 'linear curve distributes evenly');
ok(P.smoothRamp({}).length===5, 'ramp defaults to 5 layers');

// ---- elevation ----
ok(P.elevation(0).length===0, 'elevation 0 empty');
ok(P.elevation(3).length===2, 'elevation 3 has 2 layers');
ok(P.elevation(5)[1].blur===64, 'elevation 5 outer blur');
ok(P.elevation(99).length===P.elevation(5).length, 'elevation clamps to 5');
ok(P.elevation(2,'#5e6ad2')[0].color==='#5e6ad2', 'elevation accepts color');

// ---- totalAlpha / invert ----
ok(P.totalAlpha([{alpha:0.1},{alpha:0.2}])===0.3, 'totalAlpha sums');
ok(P.totalAlpha([])===0, 'totalAlpha empty');
var inv=P.invert([{x:2,y:5,alpha:0.1}]);
ok(inv[0].y===-5 && inv[0].x===-2, 'invert flips offsets');

// ---- exports ----
ok(P.toCssVar('elev-2',two,'box').indexOf('--elev-2: ')===0, 'toCssVar');
ok(P.toTailwind(two,'box').indexOf('shadow-[')===0, 'toTailwind box');
ok(P.toTailwind(two,'box').indexOf(' ')<0, 'toTailwind has no spaces');

// ---- lint ----
ok(P.lint([],'box')[0].level==='info', 'lint empty info');
ok(P.lint([{alpha:0.4},{alpha:0.4}],'box').some(function(x){return x.msg.indexOf('累计不透明度')>=0;}), 'lint total alpha');
ok(P.lint([{alpha:0.6}],'box').some(function(x){return x.msg.indexOf('过重')>=0;}), 'lint per-layer alpha');
ok(P.lint([{y:4,blur:0,spread:0,alpha:0.2}],'box').some(function(x){return x.msg.indexOf('硬边')>=0;}), 'lint hard edge');
ok(P.lint([{y:2,blur:1,spread:0,alpha:0.1}],'box').some(function(x){return x.msg.indexOf('生硬')>=0;}), 'lint blur too small');
ok(P.lint([{y:-20,blur:40,alpha:0.1}],'box').some(function(x){return x.msg.indexOf('光源')>=0;}), 'lint light from below');
ok(P.lint([{y:2,blur:6,spread:3,alpha:0.1}],'text').some(function(x){return x.level==='error';}), 'lint text spread error');
ok(P.lint([{y:2,blur:6,alpha:0.1,inset:true}],'drop').some(function(x){return x.level==='error';}), 'lint drop inset error');
ok(P.lint(P.smoothRamp({layers:12,alpha:0.2}),'box').some(function(x){return x.msg.indexOf('绘制成本')>=0;}), 'lint too many layers');
ok(P.lint([{y:2,blur:6,alpha:0.1,inset:true},{y:2,blur:6,alpha:0.1}],'box').some(function(x){return x.msg.indexOf('inset')>=0;}), 'lint mixed inset');
ok(P.lint(P.elevation(2),'box').length===0, 'material elevation is clean');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
