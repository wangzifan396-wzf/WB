const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('basic', A.slugify('Hello World')==='hello-world');
ok('diacritics', A.slugify('Héllo Wörld')==='hello-world');
ok('cafe', A.slugify('café')==='cafe');
ok('collapse spaces', A.slugify('  Multiple   Spaces  ')==='multiple-spaces');
ok('symbols', A.slugify('My Blog Post #1')==='my-blog-post-1');
ok('mixed sep', A.slugify('Foo_Bar.Baz')==='foo-bar-baz');
ok('sharp-s', A.slugify('Über Straße')==='uber-strasse');
ok('trim edges', A.slugify('---leading---')==='leading');
ok('underscore sep', A.slugify('a b c',{separator:'_'})==='a_b_c');
ok('no sep', A.slugify('a b c',{separator:''})==='abc');
ok('keep case', A.slugify('Hello World',{lowercase:false})==='Hello-World');
ok('maxlen trim', A.slugify('this is a very long title',{maxLength:10})==='this-is-a');
ok('deburr n-tilde', A.deburr('Ñoño')==='Nono');
ok('lines', A.slugifyLines('Hello World\nFoo Bar')==='hello-world\nfoo-bar');
console.log('SlugForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
