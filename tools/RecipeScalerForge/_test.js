
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.scaleRecipe('100 g 面粉\n2 个 鸡蛋', 4, 8);
ok('factor', r.factor===2);
ok('scale', r.items[0]==='200 g 面粉' && r.items[1]==='4 个 鸡蛋');
ok('round', A.round2(2.567)===2.57);
var e=A.scaleRecipe('少许 盐', 2, 4);
ok('keep', e.items[0]==='少许 盐' && e.factor===2);
ok('empty', A.scaleRecipe('', 1, 1).count===0);
console.log('RecipeScalerForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
