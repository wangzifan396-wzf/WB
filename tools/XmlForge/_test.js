const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('formatXml', A.formatXml('<a><b>hi</b><c/></a>')==='<a>\n  <b>\n    hi\n  </b>\n  <c/>\n</a>');
ok('validate ok', A.validateXml('<a><b/></a>').ok===true);
ok('validate mismatch', A.validateXml('<a><b></a>').ok===false);
ok('validate unclosed', A.validateXml('<a><b>').ok===false);
ok('escapeXml', A.escapeXml('<a>&')==='&lt;a&gt;&amp;');
console.log('XmlForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
