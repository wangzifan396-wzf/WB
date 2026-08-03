
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('enigma AAAAA', A.enigmaEncrypt('AAAAA',['I','II','III'],[0,0,0],[0,0,0],null)==='BDZGO');
ok('enigma rt', (function(){var s=A.enigmaEncrypt('HELLOWORLD',['I','II','III'],[0,0,0],[0,0,0],null);var d=A.enigmaEncrypt(s,['I','II','III'],[0,0,0],[0,0,0],null);return d==='HELLOWORLD';})());
ok('enigma plugboard rt', (function(){var p={A:'B',B:'A'};var s=A.enigmaEncrypt('TEST',['I','II','III'],[0,0,0],[0,0,0],p);var d=A.enigmaEncrypt(s,['I','II','III'],[0,0,0],[0,0,0],p);return d==='TEST';})());
ok('enigma lowercase', A.enigmaEncrypt('hello',['I','II','III'],[0,0,0],[0,0,0],null)===A.enigmaEncrypt('HELLO',['I','II','III'],[0,0,0],[0,0,0],null));
console.log('EnigmaForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
