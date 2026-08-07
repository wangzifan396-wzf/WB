
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.build({x:2,y:4,blur:6,spread:0,color:'#000'});
ok('css string', r.css==='2px 4px 6px 0px #000');
var ins=A.build({x:1,y:1,inset:true});
ok('inset prefix', ins.css.indexOf('inset')===0);
ok('bad blur', A.build({blur:-1}).error!==undefined);
ok('layers join', A.layers([{x:1,y:1},{x:2,y:2}]).split(', ').length===2);
console.log('BoxShadowForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
