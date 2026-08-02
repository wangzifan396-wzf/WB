const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('sha3-256 empty', A.sha3_256('')==='a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a');
ok('sha3-256 abc', A.sha3_256('abc')==='3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532');
ok('sha3-512 empty', A.sha3_512('')==='a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26');
ok('keccak-256 empty', A.keccak256('')==='c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
ok('keccak-256 abc', A.keccak256('abc')==='4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45');
ok('sha3-256 len 64', A.sha3_256('x').length===64);
ok('sha3-512 len 128', A.sha3_512('x').length===128);
ok('deterministic', A.sha3_256('hello')===A.sha3_256('hello'));
ok('inputs differ', A.sha3_256('abc')!==A.sha3_256('abd'));
ok('sha3 vs keccak differ', A.sha3_256('abc')!==A.keccak256('abc'));
var long1=new Array(201).join('a'), long2=new Array(200).join('a');
ok('multi-block deterministic', A.sha3_256(long1)===A.sha3_256(long1));
ok('multi-block differs', A.sha3_256(long1)!==A.sha3_256(long2));
ok('utf8 chinese len', /^[0-9a-f]{64}$/.test(A.sha3_256('\u4f60\u597d')));
ok('hex charset', /^[0-9a-f]{64}$/.test(A.keccak256('hello world')));
console.log('Sha3Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
