
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }
function near(n,g,e,eps){ if(Math.abs(g-e)<=(eps||1e-6)) pass++; else {fail++;console.error('FAIL '+n+': got '+g+' want~'+e);} }

near('vcpu 1769', C.vcpu(1769), 1);
near('vcpu 512', C.vcpu(512), 0.289, 0.01);
near('vcpu 3008', C.vcpu(3008), 1.7, 0.01);

eq('valid ok', C.validate({mem:512,timeout:30,eps:512,arch:'x86'}).length, 0);
ok('valid mem low', C.validate({mem:64}).length>0);
ok('valid mem high', C.validate({mem:20000}).length>0);
ok('valid timeout', C.validate({mem:512,timeout:9999}).length>0);
ok('valid arch', C.validate({mem:512,arch:'risc'}).length>0);
ok('valid step', C.validate({mem:3500}).length>0); // >3008 非 1024 步进

{
  const r=C.cost({requests:1e6, durationMs:200, mem:512, arch:'x86'});
  eq('cost gbsec', r.value.gbsec, 100000);
  near('cost compute', r.value.computeUsd, 1.66667, 1e-4);
  near('cost req', r.value.requestUsd, 0.2, 1e-9);
  near('cost total', r.value.totalUsd, 1.86667, 1e-4);
}
ok('cost missing', C.cost({requests:1e6}).error!=null);

{
  const c=C.compareCost({requests:1e6, durationMs:200, mem:512});
  ok('arm cheaper', c.value.arm < c.value.x86);
  ok('arm save pct', c.value.savePct>0);
}

eq('recommend good', C.recommend({mem:2048}).length, 1);
eq('recommend low', C.recommend({mem:256}).length, 1);

{
  const r=C.iamRole({});
  eq('iam basic stmts', r.value.policy.Statement.length, 1);
  eq('iam trust svc', r.value.trust.Statement[0].Principal.Service, 'lambda.amazonaws.com');
}
{
  const r=C.iamRole({s3:'my-bucket', dynamo:'my-table'});
  eq('iam 3 stmts', r.value.policy.Statement.length, 3);
}

ok('sam memory', /MemorySize: 512/.test(C.samSnippet({mem:512})));
ok('sam arm', /arm64/.test(C.samSnippet({mem:512,arch:'arm'})));

console.log((fail?'FAIL':'PASS')+' LambdaForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
