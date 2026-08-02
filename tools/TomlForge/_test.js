const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('int', A.tomlParse('a = 1').a===1);
ok('string', A.tomlParse('name = "hi"').name==='hi');
ok('float', A.tomlParse('f = 1.5').f===1.5);
ok('bool true', A.tomlParse('b = true').b===true);
ok('bool false', A.tomlParse('b = false').b===false);
ok('comment line', A.tomlParse('# x\n a = 1').a===1);
ok('inline comment', A.tomlParse('a = 1 # c').a===1);
ok('table', JSON.stringify(A.tomlParse('[t]\nx=2'))==='{"t":{"x":2}}');
ok('nested table', JSON.stringify(A.tomlParse('[a.b]\ny=1'))==='{"a":{"b":{"y":1}}}');
ok('array of tables', JSON.stringify(A.tomlParse('[[items]]\nname="a"\n[[items]]\nname="b"'))==='{"items":[{"name":"a"},{"name":"b"}]}');
ok('array value', JSON.stringify(A.tomlParse('nums = [1, 2, 3]'))==='{"nums":[1,2,3]}');
ok('string escape', A.tomlParse('s = "a\\nb"').s==='a\nb');
ok('empty', JSON.stringify(A.tomlParse(''))==='{}');
ok('negative', A.tomlParse('n = -3').n===-3);
ok('top + table', JSON.stringify(A.tomlParse('title="x"\n[t]\ny=1'))==='{"title":"x","t":{"y":1}}');
console.log('TomlForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
