
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var u=C.parseUrls('https://a.com\nftp://x\nhttps://b.com\n  ').value; ok('urls', u.length===2 && u[0]==='https://a.com');
var s=C.summarize([{ok:true,ms:10},{ok:false,ms:5},{ok:true,ms:20}]).value; ok('sum', s.up===2 && s.down===1 && s.avg===15);
console.log((fail?'FAIL':'PASS')+' UptimeForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);