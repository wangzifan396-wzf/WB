
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('all black', A.mmScore(['R','G','B','Y'],['R','G','B','Y']).black===4);
ok('all white', A.mmScore(['R','G','B','Y'],['Y','B','G','R']).white===4);
ok('one black', A.mmScore(['R','G','B','Y'],['R','R','R','R']).black===1);
ok('zero', A.mmScore(['R','G','B','Y'],['P','P','P','P']).black===0 && A.mmScore(['R','G','B','Y'],['P','P','P','P']).white===0);
ok('colors', A.MM_COLORS.length===6);
console.log('MastermindForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
