const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('parse splits', A.parse('5, 8, 3').length===3);
ok('parse filters nan', A.parse('5,x,3').length===2);
var r1=A.line([5,8,3,12,7]);
ok('svg root', typeof r1.svg==='string' && r1.svg.indexOf('<svg')===0);
ok('has polyline', r1.svg.indexOf('<polyline')>=0);
ok('points count', r1.points.length===5);
ok('min max', r1.min===3 && r1.max===12);
var r2=A.line([1,1,1]);
ok('flat range', r2.min<r2.max);
ok('empty error', A.line([]).error!==undefined);
var r3=A.line([5,8,3],{fill:false,dot:false});
ok('no fill polygon', r3.svg.indexOf('<polygon')<0);
ok('no dot circle', r3.svg.indexOf('<circle')<0);
var r4=A.line([5,8,3],{width:300,height:100});
ok('custom size', r4.svg.indexOf('width="300"')>=0 && r4.svg.indexOf('height="100"')>=0);
var b1=A.bars([1,2,3,4]);
ok('bars svg', b1.svg.indexOf('<rect')>=0 && b1.min===1 && b1.max===4);
console.log('SparkForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
