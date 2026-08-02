const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('minify', A.minifyHtml('<div>  <p>hi</p>  </div>')==='<div><p>hi</p></div>');
ok('format', A.formatHtml('<div><p>hi</p></div>')==='<div>\n  <p>\n    hi\n  </p>\n</div>');
ok('escape', A.escapeHtml('<a>&')==='&lt;a&gt;&amp;');
ok('unescape', A.unescapeHtml('&lt;a&gt;&amp;')==='<a>&');
console.log('HtmlForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
