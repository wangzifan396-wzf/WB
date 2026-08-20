
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('hash', typeof A.hashStr('a')==='number' && A.hashStr('a')===A.hashStr('a'));
var a=A.buildWorksheet({subject:'数学',grade:'初中',topic:'一元一次方程',types:'填空题\n简答题\n判断题',per:4});
ok('full', a.sectionCount===3 && a.itemCount===12 && a.total===12 && a.title.indexOf('一元一次方程')>=0 && a.markdown.indexOf('初中')>=0);
ok('sections', a.markdown.indexOf('一、填空题')>=0 && a.markdown.indexOf('二、简答题')>=0 && a.markdown.indexOf('三、判断题')>=0);
ok('answers', a.markdown.indexOf('参考答案')>=0 && a.answers===12);
var tf=A.buildWorksheet({topic:'X',types:'判断题',per:2});
ok('tf', (tf.answers===2) && /正确|错误/.test(tf.markdown) && (tf.markdown.indexOf('正确')>=0||tf.markdown.indexOf('错误')>=0));
var mc=A.buildWorksheet({topic:'Y',types:'选择题',per:1});
ok('mc', mc.markdown.indexOf('正确答案：')>=0);
var e=A.buildWorksheet({});
ok('empty', e.markdown.indexOf('（待填写主题）')>=0 && e.sectionCount===3 && e.itemCount===12);
console.log('WorksheetForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
