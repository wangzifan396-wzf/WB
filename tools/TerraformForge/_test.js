
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return TerraformForgePure();')();
const assert=require('assert');

// ---------- 基础解析 ----------
var src=[
 '# 顶部注释',
 'variable "region" {',
 '  type = string',
 '  description = "区域"',
 '  default = "ap-east-1"',
 '}',
 'locals {',
 '  prefix = "svc"',
 '}',
 'resource "aws_instance" "web" {',
 '  ami           = data.aws_ami.ubuntu.id',
 '  instance_type = var.region',
 '  tags          = local.prefix',
 '}',
 'data "aws_ami" "ubuntu" {',
 '  most_recent = true',
 '}',
 'output "ip" {',
 '  value = aws_instance.web.private_ip',
 '}'
].join('\n');
var pr=P.parse(src);
assert.strictEqual(pr.errors.length,0,'no parse errors: '+JSON.stringify(pr.errors));
var blocks=pr.items.filter(function(x){return x.kind==='block';});
assert.strictEqual(blocks.length,5,'5 top blocks, got '+blocks.length);
assert.strictEqual(blocks[0].type,'variable');
assert.deepStrictEqual(blocks[0].labels,['region']);
assert.strictEqual(P.findAttr(blocks[0].body,'type').value,'string','attr value');
assert.strictEqual(P.findAttr(blocks[0].body,'default').value,'"ap-east-1"','string attr keeps quotes');
assert.deepStrictEqual(blocks[2].labels,['aws_instance','web'],'resource labels');

// ---------- 引用提取 ----------
var refs=P.refsIn('ami = data.aws_ami.ubuntu.id');
assert.deepStrictEqual(refs,[{kind:'data',name:'aws_ami.ubuntu'}],'data ref');
assert.deepStrictEqual(P.refsIn('x = var.foo'),[{kind:'var',name:'foo'}],'var ref');
assert.deepStrictEqual(P.refsIn('x = local.bar'),[{kind:'local',name:'bar'}],'local ref');
assert.deepStrictEqual(P.refsIn('x = module.net.vpc_id'),[{kind:'module',name:'net'}],'module ref');
assert.deepStrictEqual(P.refsIn('x = aws_instance.web.id'),[{kind:'resource',name:'aws_instance.web'}],'resource ref');
assert.strictEqual(P.refsIn('x = "plain string"').length,0,'no false ref');

// ---------- 依赖图 ----------
var g=P.graph(pr.items);
assert.strictEqual(g.nodes.length,3,'resource+data+output nodes, got '+g.nodes.length);
function hasEdge(f,t){ return g.edges.some(function(e){return e.from===f&&e.to===t;}); }
assert.ok(hasEdge('aws_instance.web','data.aws_ami.ubuntu'),'edge to data');
assert.ok(hasEdge('aws_instance.web','var.region'),'edge to var');
assert.ok(hasEdge('aws_instance.web','local.prefix'),'edge to local');
assert.ok(hasEdge('output.ip','aws_instance.web'),'edge output->resource');

// ---------- 体检：未声明变量 ----------
var bad=P.analyze('resource "aws_s3_bucket" "b" {\n  bucket = var.nope\n}');
assert.ok(bad.issues.some(function(x){return /未声明的变量：var.nope/.test(x.text);}),'undeclared var');
assert.ok(bad.errCount>=1,'error counted');
// 未定义 local
var bad2=P.analyze('output "o" {\n  value = local.ghost\n}');
assert.ok(bad2.issues.some(function(x){return /未定义的局部值：local.ghost/.test(x.text);}),'undefined local');

// ---------- 体检：count 与 for_each 互斥 ----------
var ce=P.analyze('resource "aws_instance" "a" {\n  count = 2\n  for_each = var.m\n}\nvariable "m" { type = map(string) }');
assert.ok(ce.issues.some(function(x){return /不能同时使用 count 与 for_each/.test(x.text);}),'count+for_each');

// ---------- 体检：0.0.0.0/0 ----------
var open=P.analyze('resource "aws_security_group" "s" {\n  cidr_blocks = ["0.0.0.0/0"]\n}');
assert.ok(open.issues.some(function(x){return /0\.0\.0\.0\/0/.test(x.text);}),'open cidr warned');

// ---------- 体检：明文凭据 ----------
var sec=P.analyze('resource "aws_db_instance" "d" {\n  password = "SuperSecret123"\n}');
assert.ok(sec.issues.some(function(x){return /明文凭据/.test(x.text);}),'plaintext secret');
var secv=P.analyze('variable "db_password" {\n  default = "hunter2xyz"\n}');
assert.ok(secv.issues.some(function(x){return /明文 default/.test(x.text);}),'plaintext var default');

// ---------- 体检：重复地址 / 缺 source ----------
var dup=P.analyze('resource "aws_s3_bucket" "b" {}\nresource "aws_s3_bucket" "b" {}');
assert.ok(dup.issues.some(function(x){return /重复的地址/.test(x.text);}),'duplicate address');
var nosrc=P.analyze('module "net" {\n  cidr = "10.0.0.0/16"\n}');
assert.ok(nosrc.issues.some(function(x){return /缺少 source/.test(x.text);}),'module without source');

// ---------- 体检：未使用变量 / 缺 description ----------
var un=P.analyze('variable "ghost" {\n  type = string\n}');
assert.ok(un.issues.some(function(x){return /从未被引用/.test(x.text);}),'unused var');
assert.ok(un.issues.some(function(x){return /缺少 description/.test(x.text);}),'missing description');

// ---------- 干净配置无 error ----------
var clean=P.analyze([
 'variable "name" {',
 '  type = string',
 '  description = "名称"',
 '}',
 'resource "aws_s3_bucket" "b" {',
 '  bucket = var.name',
 '}'].join('\n'));
assert.strictEqual(clean.errCount,0,'clean config has 0 errors: '+JSON.stringify(clean.issues));

// ---------- 格式化：'=' 对齐 + 幂等 ----------
var messy='resource "aws_instance" "web" {\n ami="ami-1"\n  instance_type   =    "t3.micro"\n}';
var f1=P.analyze(messy).formatted;
assert.ok(/ami           = "ami-1"/.test(f1),'aligned equals:\n'+f1);
assert.ok(/^resource "aws_instance" "web" \{$/m.test(f1),'block head');
var f2=P.analyze(f1).formatted;
assert.strictEqual(f1,f2,'fmt idempotent');

// ---------- 嵌套块 ----------
var nest=P.parse('resource "aws_security_group" "s" {\n  ingress {\n    from_port = 443\n  }\n}');
var sg=nest.items[0];
assert.strictEqual(sg.body.filter(function(x){return x.kind==='block';}).length,1,'nested block parsed');
assert.strictEqual(sg.body[0].type,'ingress');

// ---------- 注释与 heredoc 不干扰解析 ----------
var hd=P.parse('resource "null_resource" "n" {\n  # 注释\n  script = <<EOT\nline one }\nline two\nEOT\n  after = 1\n}');
assert.strictEqual(hd.errors.length,0,'heredoc no error: '+JSON.stringify(hd.errors));
assert.ok(P.findAttr(hd.items[0].body,'after'),'attr after heredoc parsed');

// ---------- 错误处理 ----------
assert.ok(P.analyze('').error,'empty rejected');
assert.ok(P.analyze('   ').error,'blank rejected');
var unclosed=P.analyze('resource "a" "b" {\n  x = 1');
assert.ok(unclosed.issues.some(function(x){return /未正确闭合/.test(x.text);}),'unclosed block');

console.log('PASS terraform 8/0');
