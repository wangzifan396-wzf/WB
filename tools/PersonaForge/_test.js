
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildPersona({name:'小明',role:'大学生',age:'20',goals:'高效复习\n碎片化学习',pains:'易分心',scenarios:'图书馆',quote:'我希望随时复习'});
ok('full', a.markdown.indexOf('用户画像')>=0 && a.markdown.indexOf('小明')>=0 && a.markdown.indexOf('高效复习')>=0 && a.markdown.indexOf('易分心')>=0 && a.markdown.indexOf('图书馆')>=0);
var b=A.buildPersona({});
ok('empty', b.markdown.indexOf('匿名用户')>=0 && b.markdown.indexOf('（待补充）')>=0);
var c=A.buildPersona({name:'A',role:'B',goals:'g',pains:'',scenarios:'',quote:''});
ok('noquote', c.markdown.indexOf('更高效地完成任务')>=0);
console.log('PersonaForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
