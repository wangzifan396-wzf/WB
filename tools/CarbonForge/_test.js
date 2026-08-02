
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

// 高亮
var t=P.tokenize('const x = 1;', 'js');
ok(t.some(function(o){return o.t==='keyword' && o.v==='const';}), 'js 识别关键字 const');
ok(t.some(function(o){return o.t==='ident' && o.v==='x';}), 'js 识别标识符 x');
ok(t.some(function(o){return o.t==='number' && o.v==='1';}), 'js 识别数字 1');
var tp=P.tokenize('def f(): pass', 'py');
ok(tp.some(function(o){return o.t==='keyword' && o.v==='def';}), 'py 识别 def');
var tj=P.tokenize('{"a": 1, "b": true}', 'json');
ok(tj.some(function(o){return o.t==='key' && o.v==='"a"';}), 'json 识别键 "a"');
ok(tj.some(function(o){return o.t==='keyword' && o.v==='true';}), 'json 识别 true');
ok(tj.some(function(o){return o.t==='number' && o.v==='1';}), 'json 识别数字');

// 渲染
var svg=P.renderSvg('const x = 1;', 'js', {theme:'dark', bg:'#0A0A0B', font:15, pad:40});
ok(svg.indexOf('<svg')===0, '渲染以 <svg 开头');
ok(svg.indexOf('</svg>')>0, '渲染含 </svg>');
ok(svg.indexOf('rect')>0, '含背景 rect');
ok((svg.match(/<circle/g)||[]).length===3, '含 3 个窗口圆点');
ok(svg.indexOf('const')>0, 'SVG 含代码文本');
ok(svg.indexOf('fill="#FF79C6"')>0 || svg.indexOf('fill="#FF79C6')>=0, '关键字有配色');

// 浅色主题
var svg2=P.renderSvg('x=1', 'py', {theme:'light'});
ok(svg2.indexOf('#FFFFFF')>0, '浅色主题背景为白');

// 多行
var svg3=P.renderSvg('a\nb\nc', 'js');
ok((svg3.match(/<tspan/g)||[]).length>=3, '多行生成多个 tspan');

console.log((fail?'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
if(fail) process.exit(1);
