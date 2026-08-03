
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('and', A.bwAnd('0b1100','0b1010')===8n);
ok('or', A.bwOr('0b1100','0b1010')===14n);
ok('xor', A.bwXor('0b1100','0b1010')===6n);
ok('not4', A.bwNot('0b1010',4)===5n);
ok('shl', A.bwShl('1',3)===8n);
ok('shr', A.bwShr('16',2)===4n);
ok('rol', A.bwRol('0b1',1,4)===2n);
ok('ror', A.bwRor('0b0100',1,4)===2n);
ok('bin', A.bwBin(5n,4)==='0101');
console.log('BitwiseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
