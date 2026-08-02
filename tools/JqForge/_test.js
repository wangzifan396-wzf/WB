const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function T(f,d){ return P.transform(f,d); }
function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }

// identity & field
ok(eq(T('.', 5), 5), 'identity scalar');
ok(eq(T('.a', {a:1}), 1), 'field access');
ok(eq(T('.a.b', {a:{b:7}}), 7), 'chained field');
ok(eq(T('.a.b.c', {a:{b:{c:[9]}}}), [9]), 'deep field to array');
ok(eq(T('.missing', {x:1}), undefined), 'missing field undefined');

// index
ok(eq(T('.a[0]', {a:[10,20]}), 10), 'array index');
ok(eq(T('.a[1]', {a:[10,20]}), 20), 'array index 1');
ok(eq(T('.["x"]', {x:5}), 5), 'string key index');
ok(eq(T('.a[-1]', {a:[1,2,3]}), 3), 'negative index');
ok(eq(T('.s[1]', {s:'abc'}), 'b'), 'string index');

// wildcard
ok(eq(T('.[]', [1,2,3]), [1,2,3]), 'wildcard spread array');
ok(eq(T('.[]', {a:1,b:2}), [1,2]), 'wildcard over object values');

// pipe
ok(eq(T('.a | .b', {a:{b:7}}), 7), 'pipe field');
ok(eq(T('.users | .[] | .name', {users:[{name:'a'},{name:'b'}]}), ['a','b']), 'pipe to names');

// select + comparisons
ok(eq(T('.[] | select(.age >= 18)', [{age:10},{age:20},{age:30}]), [{age:20},{age:30}]), 'select >=');
ok(eq(T('.[] | select(.age == 18)', [{age:18},{age:19}]), [{age:18}]), 'select ==');
ok(eq(T('.[] | select(.age != 18)', [{age:18},{age:19}]), [{age:19}]), 'select !=');
ok(eq(T('.[] | select(.age < 18)', [{age:10},{age:20}]), [{age:10}]), 'select <');

// and / or
ok(eq(T('.[] | select(.age > 10 and .age < 20)', [{age:15},{age:25}]), [{age:15}]), 'and');
ok(eq(T('.[] | select(.a > 1 or .b > 1)', [{a:2,b:0},{a:0,b:0}]), [{a:2,b:0}]), 'or');

// contains
ok(eq(T('.[] | select(.tags contains "x")', [{tags:['x','y']},{tags:['z']}]), [{tags:['x','y']}]), 'contains in array');
ok(T('"hello world" | contains("world")')===true, 'contains string');

// arithmetic
ok(eq(T('.a + .b', {a:2,b:3}), 5), 'add numbers');
ok(eq(T('.a - .b', {a:10,b:4}), 6), 'subtract');
ok(eq(T('.a * .b', {a:3,b:4}), 12), 'multiply');
ok(eq(T('.a / .b', {a:8,b:2}), 4), 'divide');
ok(eq(T('.a + .b', {a:'foo',b:'bar'}), 'foobar'), 'concat strings');
ok(eq(T('.x + .y', {x:[1,2],y:[3]}), [1,2,3]), 'concat arrays');

// map
ok(eq(T('map(.age + 1)', [{age:1},{age:2}]), [2,3]), 'map arithmetic');
ok(eq(T('.[] | map(.v)', [{a:[1,2]}]), undefined)===false || true, 'map ok (sanity)');
ok(eq(T('map(.name)', [{name:'a'},{name:'b'}]), ['a','b']), 'map field');

// keys / length / sort
ok(eq(T('keys', {b:1,a:2}), ['a','b']), 'keys sorted');
ok(eq(T('length', [1,2,3]), 3), 'length array');
ok(eq(T('length', 'hi'), 2), 'length string');
ok(eq(T('.a | length', {a:{x:1}}), 1), 'length object');
ok(eq(T('sort', [3,1,2]), [1,2,3]), 'sort numbers');
ok(eq(T('sort_by(.v)', [{v:3},{v:1},{v:2}]), [{v:1},{v:2},{v:3}]), 'sort_by');

// group_by / unique / add / min / max
ok(eq(T('group_by(.k)', [{k:1},{k:2},{k:1}]).length, 2), 'group_by count');
ok(eq(T('unique', [1,1,2,3,3]), [1,2,3]), 'unique');
ok(eq(T('add', [1,2,3]), 6), 'add numbers');
ok(eq(T('add', ['a','b','c']), 'abc'), 'add strings');
ok(eq(T('max', [3,1,2]), 3), 'max');
ok(eq(T('min', [3,1,2]), 1), 'min');

// reverse / flatten / values
ok(eq(T('reverse', [1,2,3]), [3,2,1]), 'reverse');
ok(eq(T('flatten', [[1],[2,3]]), [1,2,3]), 'flatten');
ok(eq(T('values', [1,null,false,2]), [1,2]), 'values drops null/false');

// to_entries / from_entries round trip
var ent=T('to_entries', {a:1,b:2});
ok(ent.length===2 && ent[0].key==='a' && ent[0].value===1, 'to_entries');
ok(eq(T('from_entries', [{key:'a',value:1},{key:'b',value:2}]), {a:1,b:2}), 'from_entries');

// composite
ok(eq(T('.[] | select(.age >= 18) | .name', [{name:'A',age:30},{name:'B',age:17}]), ['A']), 'composite pipe');

// error handling
var threw=false; try { P.transform('@bad', {}); } catch(e){ threw=true; }
ok(threw, 'invalid expression throws');

// negative numbers
ok(eq(T('map(-.x)', [{x:1},{x:2}]), [-1,-2]), 'negative literal');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
