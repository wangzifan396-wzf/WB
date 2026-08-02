const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('h1', A.mdToHtml('# Hello')==='<h1>Hello</h1>');
ok('h3', A.mdToHtml('### Sub')==='<h3>Sub</h3>');
ok('bold', A.mdToHtml('**b**')==='<p><strong>b</strong></p>');
ok('italic', A.mdToHtml('*i*')==='<p><em>i</em></p>');
ok('inline code', A.mdToHtml('`x=1`')==='<p><code>x=1</code></p>');
ok('code block', A.mdToHtml('```\nvar a=1;\n```')==='<pre><code>var a=1;</code></pre>');
ok('link', A.mdToHtml('[a](https://b.c)')==='<p><a href="https://b.c">a</a></p>');
ok('ul', A.mdToHtml('- x\n- y')==='<ul><li>x</li><li>y</li></ul>');
ok('ol', A.mdToHtml('1. x\n2. y')==='<ol><li>x</li><li>y</li></ol>');
ok('blockquote', A.mdToHtml('> quote')==='<blockquote>quote</blockquote>');
ok('hr', A.mdToHtml('---')==='<hr>');
ok('escape script', A.mdToHtml('<script>x<\/script>').indexOf('&lt;script&gt;')>=0);
ok('paragraph join', A.mdToHtml('line1\nline2')==='<p>line1 line2</p>');
console.log('MarkdownForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
