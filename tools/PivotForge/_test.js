const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var csv='region,product,amount\nNorth,Widget,120\nNorth,Gadget,80\nSouth,Widget,200\nSouth,Gadget,50\nNorth,Widget,30';
var rows=A.parseCsv(csv).rows;
ok('parseCsv rows', rows.length===5 && rows[0].region==='North');
ok('parseCsv error short', A.parseCsv('a,b').error!==null);
ok('parseCsv error jagged', A.parseCsv('a,b\n1').error!==null);
var p=A.pivot(rows,'region','product','amount','sum');
ok('pivot dims sorted', JSON.stringify(p.rows)==='["North","South"]' && JSON.stringify(p.cols)==='["Gadget","Widget"]');
ok('pivot sum cell', p.matrix[0][1]===150 && p.matrix[1][0]===50);
ok('pivot rowTotals', p.rowTotals[0]===230 && p.rowTotals[1]===250);
ok('pivot colTotals', p.colTotals[0]===130 && p.colTotals[1]===350);
ok('pivot grand', p.grand===480);
var pc=A.pivot(rows,'region','product','amount','count');
ok('pivot count', pc.matrix[0][1]===2 && pc.grand===5);
var pa=A.pivot(rows,'region','product','amount','avg');
ok('pivot avg', pa.matrix[0][1]===75 && pa.matrix[1][1]===200);
var pm=A.pivot(rows,'region','product','amount','min');
ok('pivot min/max', pm.matrix[0][1]===30 && A.pivot(rows,'region','product','amount','max').matrix[0][1]===120);
var sparse=A.pivot([{r:'a',c:'x',v:'1'},{r:'b',c:'y',v:'2'}],'r','c','v','sum');
ok('missing cell null', sparse.matrix[0][1]===null && sparse.matrix[1][0]===null);
console.log('PivotForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
