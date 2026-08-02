
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return AsyncapiForgePure();')();
const assert=require('assert');
function has(r, re){ return r.issues.some(function(x){ return re.test(x.text); }); }
function hasLevel(r, lvl, re){ return r.issues.some(function(x){ return x.level === lvl && re.test(x.text); }); }

var GOOD = [
'asyncapi: 3.0.0',
'info:',
'  title: 订单事件',
'  version: 1.0.0',
'  description: 订单域对外发布的领域事件',
'  contact:',
'    name: 订单组',
'defaultContentType: application/json',
'servers:',
'  production:',
'    host: kafka.example.com:9092',
'    protocol: kafka-secure',
'channels:',
'  orderCreated:',
'    address: order.created',
'    messages:',
'      OrderCreated:',
'        $ref: \'#/components/messages/OrderCreated\'',
'operations:',
'  publishOrderCreated:',
'    action: send',
'    summary: 订单创建后发布事件',
'    channel:',
'      $ref: \'#/channels/orderCreated\'',
'  consumeOrderCreated:',
'    action: receive',
'    summary: 履约侧消费',
'    channel:',
'      $ref: \'#/channels/orderCreated\'',
'components:',
'  securitySchemes:',
'    saslScram:',
'      type: scramSha512',
'  messages:',
'    OrderCreated:',
'      name: OrderCreated',
'      contentType: application/json',
'      examples:',
'        - payload:',
'            orderId: "A1001"',
'      payload:',
'        type: object',
'        properties:',
'          orderId:',
'            type: string'
].join('\n');

// ---- 解析 ----
var pd = P.parseDoc(GOOD);
assert.strictEqual(pd.format, 'yaml');
assert.strictEqual(pd.value.info.title, '订单事件');
assert.strictEqual(pd.value.asyncapi, '3.0.0');
assert.ok(P.parseDoc('').error, '空输入');
// JSON 也吃
var pj = P.parseDoc('{"asyncapi":"3.0.0","info":{"title":"t","version":"1"}}');
assert.strictEqual(pj.format, 'json');
assert.strictEqual(pj.value.info.title, 't');
assert.ok(P.parseDoc('{bad json').error, '坏 JSON');

// ---- 版本识别 ----
assert.strictEqual(P.detectVersion({asyncapi:'3.0.0'}).value.generation, 'v3');
assert.strictEqual(P.detectVersion({asyncapi:'2.6.0'}).value.generation, 'v2');
assert.strictEqual(P.detectVersion({asyncapi:'1.2.0'}).value.generation, 'legacy');
assert.strictEqual(P.detectVersion({asyncapi:'3.0.0'}).value.minor, 0);
assert.ok(P.detectVersion({}).error, '缺版本');
assert.ok(/OpenAPI/.test(P.detectVersion({openapi:'3.1.0'}).error), '认出 OpenAPI');
assert.ok(/Swagger/.test(P.detectVersion({swagger:'2.0'}).error), '认出 Swagger');
assert.ok(P.detectVersion({asyncapi:'v3'}).error, '版本格式非法');

// ---- 协议表 ----
assert.strictEqual(P.protocolInfo('kafka').defaultPort, 9092);
assert.strictEqual(P.protocolInfo('MQTT').defaultPort, 1883, '大小写不敏感');
assert.strictEqual(P.protocolInfo('nope'), null);
assert.ok(Object.keys(P.PROTOCOLS).length >= 15, '常见协议要够全');

// ---- 引用解析 ----
var doc = P.parseDoc(GOOD).value;
assert.strictEqual(P.resolveRef(doc, '#/channels/orderCreated').value.address, 'order.created');
assert.strictEqual(P.resolveRef(doc, '#/info/title').value, '订单事件');
assert.ok(P.resolveRef(doc, '#/channels/nope').error, '断引用');
assert.ok(P.resolveRef(doc, 'http://x/y').error, '只支持文档内引用');

// ---- 地址风格 ----
assert.strictEqual(P.addressStyle('order.created').style, 'dot');
assert.strictEqual(P.addressStyle('order.created').segments, 2);
assert.strictEqual(P.addressStyle('a/b/c').style, 'slash');
assert.strictEqual(P.addressStyle('a/b/c').segments, 3);
assert.strictEqual(P.addressStyle('plain').style, 'flat');
assert.strictEqual(P.addressStyle('user/{id}/events').hasParam, true);
assert.strictEqual(P.addressStyle('sensor/+/temp').wildcard, true);

// ---- 合规文档零错误 ----
var L = P.lint(doc);
assert.strictEqual(L.errors, 0, '合规样例不该有错误：' + JSON.stringify(L.issues.filter(function(i){return i.level==='error';})));
assert.strictEqual(L.ok, true);
assert.ok(hasLevel(L, 'ok', /AsyncAPI 3\.0\.0/));
assert.ok(hasLevel(L, 'ok', /kafka-secure/));

// ---- 缺必填 ----
assert.ok(hasLevel(P.lint({asyncapi:'3.0.0'}), 'error', /缺少 info/));
assert.ok(hasLevel(P.lint({asyncapi:'3.0.0', info:{version:'1'}}), 'error', /info\.title/));
assert.ok(hasLevel(P.lint({asyncapi:'3.0.0', info:{title:'t'}}), 'error', /info\.version/));
assert.ok(hasLevel(P.lint({asyncapi:'3.0.0', info:{title:'t', version:'1'}}), 'error', /缺少 channels/));

// ---- 3.0 里残留 2.x 写法 ----
var mixed = P.parseDoc([
'asyncapi: 3.0.0',
'info:',
'  title: t',
'  version: "1"',
'channels:',
'  a:',
'    address: topic.a',
'    publish:',
'      x: 1'
].join('\n')).value;
assert.ok(hasLevel(P.lint(mixed), 'error', /publish\/subscribe/), '3.0 不许用 publish');
assert.ok(hasLevel(P.lint(mixed), 'error', /未声明 messages/));

// ---- servers 字段代际错配 ----
var oldUrl = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  servers:{p:{url:'kafka:9092', protocol:'kafka'}}, channels:{a:{address:'x', messages:{M:{}}}}};
assert.ok(hasLevel(P.lint(oldUrl), 'error', /host 必填/));
assert.ok(hasLevel(P.lint(oldUrl), 'error', /仍在用 2\.x 的 url/));
// 缺协议
assert.ok(hasLevel(P.lint({asyncapi:'3.0.0', info:{title:'t', version:'1'},
  servers:{p:{host:'h'}}, channels:{a:{address:'x', messages:{M:{}}}}}), 'error', /protocol 必填/));
// 明文协议告警
assert.ok(hasLevel(P.lint({asyncapi:'3.0.0', info:{title:'t', version:'1'},
  servers:{p:{host:'h', protocol:'ws'}}, channels:{a:{address:'x', messages:{M:{}}}}}), 'warn', /明文协议/));

// ---- 地址重复与参数缺定义 ----
var dupAddr = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'same', messages:{M:{}}}, b:{address:'same', messages:{M:{}}}}};
assert.ok(hasLevel(P.lint(dupAddr), 'error', /重复占用/));
var param = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'user/{id}/ev', messages:{M:{}}}}};
assert.ok(hasLevel(P.lint(param), 'error', /parameters 定义/));
// 风格混用告警
var mixStyle = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'order.created', messages:{M:{}}}, b:{address:'order/paid', messages:{M:{}}}}};
assert.ok(hasLevel(P.lint(mixStyle), 'warn', /风格不统一/));

// ---- operations 校验 ----
var badOp = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'x', messages:{M:{}}}},
  operations:{o1:{action:'publish', channel:{$ref:'#/channels/a'}}}};
assert.ok(hasLevel(P.lint(badOp), 'error', /只能是 send 或 receive/));
var dangling = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'x', messages:{M:{}}}},
  operations:{o1:{action:'send', channel:{$ref:'#/channels/nope'}}}};
assert.ok(hasLevel(P.lint(dangling), 'error', /不存在的节点/));
var noRef = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'x', messages:{M:{}}}}, operations:{o1:{action:'send'}}};
assert.ok(hasLevel(P.lint(noRef), 'error', /必须是指向通道的/));
// 单向文档告警
var onlySend = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'x', messages:{M:{}}}},
  operations:{o1:{action:'send', summary:'s', channel:{$ref:'#/channels/a'}}}};
assert.ok(hasLevel(P.lint(onlySend), 'warn', /没有描述任何消费方/));

// ---- 消息载荷 ----
var noPayload = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'x', messages:{M:{}}}},
  components:{messages:{M:{name:'M'}}}};
assert.ok(hasLevel(P.lint(noPayload), 'error', /缺少 payload/));
var looseObj = {asyncapi:'3.0.0', info:{title:'t', version:'1'},
  channels:{a:{address:'x', messages:{M:{}}}},
  components:{messages:{M:{name:'M', payload:{type:'object'}}}}};
assert.ok(hasLevel(P.lint(looseObj), 'warn', /没有 properties/));

// ---- 拓扑 ----
var T = P.topology(doc);
assert.strictEqual(T.value.channelCount, 1);
assert.strictEqual(T.value.operationCount, 2);
assert.strictEqual(T.value.sends, 1);
assert.strictEqual(T.value.receives, 1);
assert.strictEqual(T.value.dangling, 0);
assert.strictEqual(T.value.nodes[0].address, 'order.created');
assert.strictEqual(P.topology(dangling).value.dangling, 1, '断引用要被统计出来');

// ---- 2.x 迁移 ----
var v2 = P.parseDoc([
'asyncapi: 2.6.0',
'info:',
'  title: 旧版',
'  version: "1"',
'servers:',
'  prod:',
'    url: kafka:9092',
'    protocol: kafka',
'channels:',
'  order.created:',
'    subscribe:',
'      message:',
'        payload:',
'          type: object',
'  order.paid:',
'    publish:',
'      message:',
'        payload:',
'          type: object'
].join('\n')).value;
var mg = P.migrationHints(v2);
assert.ok(mg.value.length >= 6, '给出完整对照表');
assert.strictEqual(mg.concrete.length, 2, '两个通道各一条具体改写');
assert.ok(mg.concrete.some(function(s){ return /subscribe.*action: send/.test(s); }), 'subscribe 对应 send');
assert.ok(mg.concrete.some(function(s){ return /publish.*action: receive/.test(s); }), 'publish 对应 receive');
assert.strictEqual(P.migrationHints(doc).value.length, 0, '3.x 无需迁移');
assert.ok(hasLevel(P.lint(v2), 'warn', /建议迁移/));

// ---- 汇总入口 ----
var A = P.analyze(GOOD);
assert.strictEqual(A.ok, true);
assert.strictEqual(A.grade, '完整');
assert.strictEqual(A.value.topology.channelCount, 1);
assert.ok(P.analyze('').error);
var A2 = P.analyze('asyncapi: 2.6.0\ninfo:\n  title: t\n  version: "1"\nchannels:\n  a:\n    publish:\n      x: 1');
assert.ok(A2.value.concrete.length > 0, '2.x 文档给出具体迁移点');

console.log('PASS asyncapi 8/0');
