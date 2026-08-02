const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('linear', A.buildGradient('linear',90,[{color:'#fff',pos:0},{color:'#000',pos:100}])==='linear-gradient(90deg, #fff 0%, #000 100%)');
ok('radial', A.buildGradient('radial',0,[{color:'red',pos:0},{color:'blue',pos:100}])==='radial-gradient(circle, red 0%, blue 100%)');
ok('conic prefix', A.buildGradient('conic',45,[{color:'#a',pos:0},{color:'#b',pos:100}]).indexOf('conic-gradient(from 45deg, ')===0);
ok('clamp over', A.buildStops([{color:'#f',pos:150}])==='#f 100%');
ok('clamp under', A.buildStops([{color:'#f',pos:-5}])==='#f 0%');
ok('clamp nan', A.clampPct('x')===0);
ok('multi stops', A.buildStops([{color:'#a',pos:0},{color:'#b',pos:50},{color:'#c',pos:100}])==='#a 0%, #b 50%, #c 100%');
ok('toBackground', A.toBackground('linear-gradient(x)')==='background: linear-gradient(x);');
ok('default angle', A.buildGradient('linear',undefined,[{color:'#a',pos:0},{color:'#b',pos:100}])==='linear-gradient(0deg, #a 0%, #b 100%)');
console.log('GradientForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
