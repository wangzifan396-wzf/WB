
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('cat', A.catOf('[新增] 支持导出')==='Added' && A.catOf('[修复] 登录崩溃')==='Fixed' && A.catOf('[安全] 升级依赖')==='Security' && A.catOf('优化加载速度')==='Changed' && A.catOf('移除旧接口')==='Removed');
var a=A.buildReleaseNotes({version:'1.2.0',date:'2026-08-20',changes:'[新增] 支持导出 PDF\n[修复] 修复登录崩溃\n优化列表加载速度\n[安全] 升级依赖修复 CVE'});
ok('full', a.total===4 && a.version==='1.2.0' && a.markdown.indexOf('发布说明 v1.2.0（2026-08-20）')>=0 && a.markdown.indexOf('本次发布共 4 项变更')>=0);
ok('cats', a.markdown.indexOf('新增（Added）')>=0 && a.markdown.indexOf('修复（Fixed）')>=0 && a.markdown.indexOf('安全（Security）')>=0 && a.markdown.indexOf('变更（Changed）')>=0);
ok('strip', a.markdown.indexOf('支持导出 PDF')>=0 && a.markdown.indexOf('[新增]')<0);
ok('counts', a.counts.Added===1 && a.counts.Fixed===1 && a.counts.Security===1 && a.counts.Changed===1);
var b=A.buildReleaseNotes({changes:''});
ok('empty', b.total===0 && b.markdown.indexOf('本次发布共 0 项变更')>=0);
console.log('ReleaseNotesForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
