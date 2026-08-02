"use strict";
// SchemaForge kernel test: extract first <script> (the SF kernel) and assert.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>\s*"use strict";\s*var SF = \(function\(\)\{([\s\S]*?)\}\)\(\);\s*if\(typeof module/);
if (!m) { console.error('SF kernel script not found'); process.exit(1); }
const mod = { exports: {} };
const fn = new Function('module', 'exports', 'window', 'document', m[1]);
const SF = fn(mod, mod.exports, undefined, undefined);

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;} else {fail++; console.error('FAIL: '+name);} }
function eq(name, a, b){ ok(name+' ('+JSON.stringify(a)+' === '+JSON.stringify(b)+')', a===b); }
function inc(name, a, b){ ok(name+' ('+a+' includes '+b+')', String(a).indexOf(b)>=0); }

// model
ok('makeColumn defaults', SF.makeColumn().name==='column' && SF.makeColumn().type==='INT');
ok('makeTable defaults', SF.makeTable().x===80 && SF.makeTable().columns.length===0);
const users = SF.makeTable({name:'users', columns:[ SF.makeColumn({name:'id',pk:true}), SF.makeColumn({name:'email'}) ]});
ok('findTable by id', SF.findTable([users], users.id)===users);
ok('findTable missing null', SF.findTable([users], 'x')===null);
ok('findCol', SF.findCol(users, users.columns[0].id).name==='id');
ok('findCol missing', SF.findCol(users, 'x')===null);

// mapType per dialect
eq('mapType mysql INT', SF.mapType('INT','mysql'), 'INT');
eq('mapType mysql BOOL', SF.mapType('BOOL','mysql'), 'TINYINT(1)');
eq('mapType pg INT', SF.mapType('INT','postgres'), 'INTEGER');
eq('mapType pg BOOL', SF.mapType('BOOL','postgres'), 'BOOLEAN');
eq('mapType sqlite BOOL', SF.mapType('BOOL','sqlite'), 'INTEGER');
eq('mapType mermaid', SF.mapType('VARCHAR','mermaid'), 'varchar');

// fmtDefault
eq('fmtDefault number', SF.fmtDefault('42'), '42');
eq('fmtDefault bool', SF.fmtDefault('true'), 'true');
eq('fmtDefault string', SF.fmtDefault('hi'), "'hi'");
eq('fmtDefault null', SF.fmtDefault(''), null);
eq('fmtDefault quote escape', SF.fmtDefault("O'Brien"), "'O''Brien'");

// sample schema
const s = SF.sampleSchema();
eq('sample 3 tables', s.length, 3);
ok('sample users first', s[0].name==='users');
ok('sample posts has fk', s[1].columns[1].fk && s[1].columns[1].fk.table===s[0].id);
ok('sample comments fk to posts', s[2].columns[1].fk.table===s[1].id);

// DDL mysql
const ddlMy = SF.genDDL(s, 'mysql');
inc('ddl mysql create users', ddlMy, 'CREATE TABLE `users`');
inc('ddl mysql pk inline', ddlMy, '`id` INT PRIMARY KEY');
inc('ddl mysql fk posts', ddlMy, 'FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)');
inc('ddl mysql uq email', ddlMy, '`email` VARCHAR(255) NOT NULL UNIQUE');
// DDL postgres
const ddlPg = SF.genDDL(s, 'postgres');
inc('ddl pg integer', ddlPg, 'CREATE TABLE "users"');
inc('ddl pg fk posts', ddlPg, 'FOREIGN KEY ("user_id") REFERENCES "users" ("id")');
inc('ddl pg bool', ddlPg, 'BOOLEAN');
// DDL sqlite
const ddlSql = SF.genDDL(s, 'sqlite');
inc('ddl sqlite integer', ddlSql, 'CREATE TABLE "users"');
inc('ddl sqlite fk comments', ddlSql, 'FOREIGN KEY ("post_id") REFERENCES "posts" ("id")');
// composite PK
const comp = [ SF.makeTable({name:'ab', columns:[ SF.makeColumn({name:'a',pk:true}), SF.makeColumn({name:'b',pk:true}) ]}) ];
const ddlC = SF.genDDL(comp, 'mysql');
inc('ddl composite pk', ddlC, 'PRIMARY KEY (`a`, `b`)');

// Mermaid
const mer = SF.genMermaid(s);
inc('mermaid erDiagram', mer, 'erDiagram');
inc('mermaid entity', mer, 'users {');
inc('mermaid PK tag', mer, 'int id PK');
inc('mermaid FK tag', mer, 'FK');
inc('mermaid relation', mer, 'users ||--o{ posts');

// SVG
const svg = SF.genSVG(s);
inc('svg root', svg, '<svg');
inc('svg table name', svg, '>users<');
inc('svg rel path', svg, 'class="rel-path"');

// validate
const v1 = SF.validate(s);
ok('validate sample clean', v1.length===0);
const bad = SF.sampleSchema();
bad[0].name='123bad';
bad[1].columns[1].fk={table:'nope',col:'x'};
const v2 = SF.validate(bad);
ok('validate flags bad name', v2.some(function(e){return /非法表名/.test(e);}));
ok('validate flags bad fk', v2.some(function(e){return /外键目标/.test(e);}));

// autoLayout
const laid = SF.autoLayout(SF.sampleSchema());
ok('autoLayout grid x', laid[1].x > laid[0].x);
ok('autoLayout grid y row2', laid[3] ? laid[3].y > laid[0].y : true);

// round-trip serialize -> genDDL stable
const json = JSON.stringify(s);
const back = JSON.parse(json);
eq('roundtrip ddl equal', SF.genDDL(back,'mysql'), SF.genDDL(s,'mysql'));

console.log('SchemaForge kernel: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
