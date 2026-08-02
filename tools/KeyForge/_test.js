const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('13 = Enter', A.lookupKeyCode(13).name==='Enter');
ok('27 = Escape', A.lookupKeyCode(27).name==='Escape');
ok('65 = A', A.lookupKeyCode(65).name==='A');
ok('112 = F1', A.lookupKeyCode(112).name==='F1');
ok('unknown code', A.lookupKeyCode(250).known===false);
ok('range throws', (function(){try{A.lookupKeyCode(999);return false;}catch(e){return true;}})());
ok('NaN throws', (function(){try{A.lookupKeyCode('abc');return false;}catch(e){return true;}})());
var d=A.describeKey({key:'a',code:'KeyA',keyCode:65,ctrlKey:true,shiftKey:false,altKey:false,metaKey:false});
ok('describe key', d.key==='a');
ok('describe code', d.code==='KeyA');
ok('describe keyCode', d.keyCode===65);
ok('describe mods', d.modifiers.length===1 && d.modifiers[0]==='Ctrl');
ok('describe combo', d.combo==='Ctrl + a');
var sp=A.describeKey({key:' ',code:'Space',keyCode:32,ctrlKey:false,shiftKey:false,altKey:false,metaKey:false});
ok('space normalized', sp.key==='Space');
ok('table size', Object.keys(A.KEYCODE_TABLE).length>90);
console.log('KeyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
