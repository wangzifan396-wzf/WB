// FormForge 纯函数单测：提取 index.html 第一个 <script>（应用主脚本）在 vm 中运行，断言表单构建逻辑。
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const m = html.match(/<script>([\s\S]*?)<\/script>/); // 第一个脚本 = 应用（纯函数 + DOM 守卫）
if (!m) { console.error('找不到应用 <script>'); process.exit(1); }

const sandbox = {
  module: { exports: {} }, exports: {}, console,
  Math, Date, JSON, Object, Array, String, Number, parseInt, parseFloat, isNaN
};
sandbox.window = undefined; // 确保 DOM 守卫跳过
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox);
const api = sandbox.module.exports;

let pass = 0, fail = 0;
function ok(cond, name){ if (cond) { pass++; } else { fail++; console.error('  \u2717 ' + name); } }

// 1. escapeHtml
ok(api.escapeHtml('<a>&"\'') === '&lt;a&gt;&amp;&quot;&#39;', 'escapeHtml 转义五类字符');
ok(api.escapeHtml(null) === '', 'escapeHtml(null) 返回空串');
ok(api.escapeHtml(123) === '123', 'escapeHtml 数字转字符串');

// 2. uid 唯一性 + 前缀
ok(api.uid('f') !== api.uid('f'), 'uid 每次不同');
ok(api.uid('fm').indexOf('fm') === 0, 'uid 带前缀');

// 3. clone 深拷贝
const src = { a: 1, arr: [{ x: 1 }] };
const cp = api.clone(src);
cp.arr[0].x = 99;
ok(src.arr[0].x === 1, 'clone 深拷贝隔离');

// 4. fieldCatalog
const cat = api.fieldCatalog();
ok(Array.isArray(cat) && cat.length === 13, 'fieldCatalog 共 13 种字段');
ok(cat.every(c => /^[a-z]+$/.test(c.type) && c.label), 'fieldCatalog 每项含 type+label');
ok(api.fieldCatalog().length === 13, 'fieldCatalog 稳定返回');

// 5. newField
const tf = api.newField('text');
ok(tf.type === 'text' && tf.label === '单行文本', 'newField text 标签');
ok(tf.name === '' && tf.required === false, 'newField 默认 name 空/非必填');
const sf = api.newField('select');
ok(Array.isArray(sf.options) && sf.options.length === 2, 'newField select 默认播种 2 个选项');
const cf = api.newField('checkbox');
ok(Array.isArray(cf.options) && cf.options.length === 2, 'newField checkbox 默认播种选项');
const nf = api.newField('number');
ok(nf.options.length === 0, 'newField number 无选项');
ok(api.newField('bogus').type === 'text', 'newField 未知类型回退 text');

// 6. newForm
const f0 = api.newForm('反馈表');
ok(f0.name === '反馈表', 'newForm 名称');
ok(f0.fields.length === 1, 'newForm 播种 1 个字段');
ok(f0.fields[0].name === 'name' && f0.fields[0].label === '姓名', 'newForm 默认字段 name/label');
ok(f0.title === '未命名表单' && f0.submitLabel === '提交', 'newForm 默认标题/提交文字');
ok(api.newForm().name === '我的表单', 'newForm 默认名');

// 7. addField（不可变）
let f = api.addField(f0, api.newField('email'));
ok(f.fields.length === 2 && f0.fields.length === 1, 'addField 不改原对象');
ok(f.fields[1].type === 'email', 'addField 追加到末尾');

// 8. updateField
f = api.updateField(f, f.fields[0].id, { label: '用户名', required: true });
ok(api.updateField(f, f.fields[0].id, {}).fields[0].label === '用户名', 'updateField 改标签');
ok(f.fields[0].required === true, 'updateField 改必填');
ok(f0.fields[0].label === '姓名', 'updateField 不改原对象');

// 9. deleteField
const delId = f.fields[1].id;
f = api.deleteField(f, delId);
ok(f.fields.length === 1, 'deleteField 删除一个');
ok(!f.fields.some(x => x.id === delId), 'deleteField 后找不到');

// 10. moveField 重排 + 越界
f = api.newForm('m');
f = api.addField(f, api.newField('email'));
f = api.addField(f, api.newField('date'));
const order0 = f.fields.map(x => x.id);
f = api.moveField(f, order0[0], 2);
ok(f.fields[2].id === order0[0], 'moveField 移到目标位置');
ok(f.fields.length === 3, 'moveField 不丢字段');
f = api.moveField(f, order0[2], 99);
ok(f.fields[2].id === order0[2], 'moveField 越界索引落末尾');
f = api.moveField(f, order0[1], -5);
ok(f.fields[0].id === order0[1], 'moveField 负索引落开头');

// 11. sanitizeName
ok(api.sanitizeName('Hello World!') === 'hello_world', 'sanitizeName 小写+下划线');
ok(api.sanitizeName('  User@Name  ') === 'user_name', 'sanitizeName 去首尾符号');
ok(api.sanitizeName('123abc') === '123abc', 'sanitizeName 数字保留');
ok(api.sanitizeName('!!!') === '', 'sanitizeName 全符号返回空');

// 12. uniqueName
const uf = { fields: [] };
const n1 = api.uniqueName(uf, 'name');
ok(n1 === 'name', 'uniqueName 首次返回原值');
let uf2 = api.addField(uf, Object.assign(api.newField('text'), { name: 'name' }));
const n2 = api.uniqueName(uf2, 'name');
ok(n2 === 'name_2', 'uniqueName 重复追加 _2');
let uf3 = api.addField(uf2, Object.assign(api.newField('text'), { name: 'name_2' }));
const n3 = api.uniqueName(uf3, 'name');
ok(n3 === 'name_3', 'uniqueName 顺延 _3');
ok(api.uniqueName({ fields: [] }, 'Bad Name!') === 'bad_name', 'uniqueName 同时清洗');

// 13. renderFieldHtml
const txtField = { id:'a', type:'text', label:'姓名 <x>', name:'name', placeholder:'', required:false, help:'', options:[], min:'', max:'', step:'' };
const h1 = api.renderFieldHtml(txtField);
ok(h1.indexOf('姓名 &lt;x&gt;') >= 0, 'renderFieldHtml 转义标签');
ok(h1.indexOf('name="name"') >= 0, 'renderFieldHtml 输出 name');
ok(h1.indexOf('type="text"') >= 0, 'renderFieldHtml 输出 input type');
ok(h1.indexOf('<x>') < 0, 'renderFieldHtml 不泄露原始尖括号');
const selField = { id:'b', type:'select', label:'城市', name:'city', placeholder:'', required:true, help:'选城市', options:['北京','上海'], min:'', max:'', step:'' };
const h2 = api.renderFieldHtml(selField);
ok(h2.indexOf('<select') >= 0, 'renderFieldHtml select 标签');
ok(h2.indexOf('<option value="北京">北京</option>') >= 0, 'renderFieldHtml select 选项');
ok(h2.indexOf('required') >= 0 && h2.indexOf('ff-req') >= 0, 'renderFieldHtml 必填星标');
ok(h2.indexOf('选城市') >= 0, 'renderFieldHtml 帮助文字');
const chkField = { id:'c', type:'checkbox', label:'兴趣', name:'hobby', options:['A','B'], required:false, help:'', placeholder:'', min:'', max:'', step:'' };
const h3 = api.renderFieldHtml(chkField);
ok(h3.indexOf('type="checkbox"') >= 0 && h3.indexOf('name="hobby[]"') >= 0, 'renderFieldHtml checkbox 组名带 []');
const numField = { id:'d', type:'number', label:'年龄', name:'age', min:'0', max:'120', step:'1', required:false, help:'', placeholder:'', options:[] };
const h4 = api.renderFieldHtml(numField);
ok(h4.indexOf('type="number"') >= 0 && h4.indexOf('min="0"') >= 0 && h4.indexOf('max="120"') >= 0, 'renderFieldHtml number 范围属性');

// 14. renderFormInner
const innerForm = { fields:[txtField, selField], submitLabel:'发送' };
const hi = api.renderFormInner(innerForm);
ok(hi.indexOf('<form') >= 0, 'renderFormInner 含 form');
ok(hi.indexOf('type="text"') >= 0 && hi.indexOf('<select') >= 0, 'renderFormInner 含两类字段');
ok(hi.indexOf('>发送</button>') >= 0, 'renderFormInner 含提交按钮文字');

// 15. renderFormHtml（完整文档）
const docForm = { title:'报名 <表>', description:'请填写', fields:[txtField], submitLabel:'提交' };
const doc = api.renderFormHtml(docForm);
ok(doc.indexOf('<!DOCTYPE html>') === 0, 'renderFormHtml 以 DOCTYPE 开头');
ok(doc.indexOf('<title>报名 &lt;表&gt;</title>') >= 0, 'renderFormHtml 转义标题');
ok(doc.indexOf('</html>') >= 0, 'renderFormHtml 闭合 html');
ok(doc.indexOf('姓名 &lt;x&gt;') >= 0, 'renderFormHtml 内联字段转义');

// 16. validateForm
const bad1 = { fields:[{ id:'x', type:'text', label:'', name:'a', options:[], required:false, help:'', placeholder:'', min:'', max:'', step:'' }] };
ok(api.validateForm(bad1).length >= 1, 'validateForm 缺标签报错');
const bad2 = { fields:[{ id:'x', type:'text', label:'名', name:'1bad', options:[], required:false, help:'', placeholder:'', min:'', max:'', step:'' }] };
ok(api.validateForm(bad2).some(e => e.indexOf('name') >= 0), 'validateForm 非法 name 报错');
const bad3 = { fields:[
  { id:'x', type:'text', label:'名', name:'dup', options:[], required:false, help:'', placeholder:'', min:'', max:'', step:'' },
  { id:'y', type:'text', label:'名2', name:'dup', options:[], required:false, help:'', placeholder:'', min:'', max:'', step:'' }] };
ok(api.validateForm(bad3).some(e => e.indexOf('重复') >= 0), 'validateForm 重复 name 报错');
const bad4 = { fields:[{ id:'x', type:'select', label:'城', name:'city', options:[], required:false, help:'', placeholder:'', min:'', max:'', step:'' }] };
ok(api.validateForm(bad4).some(e => e.indexOf('选项') >= 0), 'validateForm 下拉无选项报错');
const bad5 = { fields:[{ id:'x', type:'number', label:'岁', name:'age', options:[], required:false, help:'', placeholder:'', min:'100', max:'1', step:'' }] };
ok(api.validateForm(bad5).some(e => e.indexOf('最小值') >= 0), 'validateForm min>max 报错');
const good = { fields:[txtField, selField], title:'t', description:'', submitLabel:'提交' };
ok(api.validateForm(good).length === 0, 'validateForm 合法表单零错误');

// 17. exportSchema / importSchema 往返
const json = api.exportSchema(good);
const imp = api.importSchema(json);
ok(imp.fields.length === good.fields.length, 'export→import 字段数一致');
ok(imp.fields[0].name === 'name' && imp.fields[1].name === 'city', 'export→import 保留 name');
let threw = false; try { api.importSchema('{bad'); } catch (e) { threw = true; }
ok(threw, 'importSchema 非法 JSON 抛错');
let threw2 = false; try { api.importSchema('{"name":"x"}'); } catch (e) { threw2 = true; }
ok(threw2, 'importSchema 缺 fields 抛错');
const fixed = api.importSchema('{"name":"x","fields":[]}');
ok(!!fixed.id && fixed.submitLabel === '提交' && Array.isArray(fixed.fields), 'importSchema 补齐 id/submitLabel');
const withType = api.importSchema('{"name":"y","fields":[{"type":"email","label":"邮箱","name":"em"}]}');
ok(withType.fields[0].type === 'email' && withType.fields[0].label === '邮箱', 'importSchema 保留字段属性');

// 18. formStats
const stForm = { fields:[
  { id:'1', type:'text', name:'a', required:true, options:[] },
  { id:'2', type:'text', name:'b', required:false, options:[] },
  { id:'3', type:'select', name:'c', required:false, options:['x'] }] };
const st = api.formStats(stForm);
ok(st.fields === 3, 'formStats 字段数');
ok(st.required === 1, 'formStats 必填数');
ok(st.byType.text === 2 && st.byType.select === 1, 'formStats 类型分布');

console.log('\nFormForge 纯函数测试: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
