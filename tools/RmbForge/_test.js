
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('1234.56', A.rmbUpper(1234.56) === "壹仟贰佰叁拾肆元伍角陆分");
ok('1000000', A.rmbUpper(1000000) === "壹佰万元整");
ok('100.5', A.rmbUpper(100.5) === "壹佰元伍角");
ok('0.05', A.rmbUpper(0.05) === "零元零伍分");
ok('0', A.rmbUpper(0) === "零元整");
ok('1e8', A.rmbUpper(100000000) === "壹亿元整");
ok('neg', A.rmbUpper(-1234.56) === "负壹仟贰佰叁拾肆元伍角陆分");
ok('100.05', A.rmbUpper(100.05) === "壹佰元零伍分");
ok('digits', A.rmbDigits(1234567.89) === "1,234,567.89");
ok('null', A.rmbUpper("abc") === null);
console.log('RmbForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
