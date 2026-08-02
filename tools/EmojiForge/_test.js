const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('search smile', A.searchEmoji('smile').length>0);
ok('byGroup 动物', A.byGroup('动物').length>0);
ok('groups has 笑脸', A.groups().indexOf('笑脸')>=0);
ok('codepoint A', A.codepoint('A')==='41');
ok('codepoint emoji', /^([0-9A-F]+)$/.test(A.codepoint('😀').replace(/ /g,'')));
ok('search empty returns all', A.searchEmoji('').length===A.EMOJIS.length);
console.log('EmojiForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
