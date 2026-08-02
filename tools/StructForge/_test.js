const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('pascal snake', A.pascal('user_name')==='UserName');
ok('pascal single', A.pascal('age')==='Age');
ok('ts flat', A.toTypeScript({name:'a',age:3},'User')==='export interface User {\n  name: string;\n  age: number;\n}');
ok('ts bool+array', A.toTypeScript({ok:true,tags:['x']},'Root').indexOf('tags: string[]')>0);
ok('ts nested', A.toTypeScript({user:{name:'a'}},'Root').indexOf('export interface User')>=0);
ok('ts nested ref', A.toTypeScript({user:{name:'a'}},'Root').indexOf('user: User')>0);
ok('go int tag', A.toGoStruct({age:3},'User')==='type User struct {\n\tAge int `json:"age"`\n}');
ok('go float', A.toGoStruct({x:1.5},'R').indexOf('float64')>0);
ok('go slice', A.toGoStruct({tags:['a']},'R').indexOf('[]string')>0);
ok('py class', A.toPython({name:'x'},'User')==='@dataclass\nclass User:\n    name: str');
ok('py int', A.toPython({age:3},'U').indexOf('age: int')>0);
ok('py list', A.toPython({tags:['a']},'U').indexOf('List[str]')>0);
ok('schema type', A.toJsonSchema({age:3}).type==='object');
ok('schema integer', A.toJsonSchema({age:3}).properties.age.type==='integer');
ok('schema required', A.toJsonSchema({age:3}).required.indexOf('age')>=0);
ok('schema array items', A.toJsonSchema({t:['a']}).properties.t.items.type==='string');
console.log('StructForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
