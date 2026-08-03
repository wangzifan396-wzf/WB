
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('trim', A.cleanText('a  \nb',{trimTail:true})==='a\nb');
ok('drop', A.cleanText('a\n\n\nb',{dropEmpty:true})==='a\nb');
ok('collapse', A.cleanText('a\n\n\nb',{collapse:true})==='a\n\nb');
ok('dedupCI', A.cleanText('a\nA\nb',{dedup:true,dedupCI:true})==='a\nb');
ok('eol', A.cleanText('a\r\nb',{eol:'lf'})==='a\nb');
ok('tabs', A.cleanText('\ta',{tabsToSpaces:true,tabSize:2})==='  a');
console.log('CleanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
