const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('en zero', A.toEnglish(0).value==='zero');
ok('en 123', A.toEnglish(123).value==='one hundred twenty-three');
ok('en 1000', A.toEnglish(1000).value==='one thousand');
ok('en 1000000', A.toEnglish(1000000).value==='one million');
ok('en 1234567', A.toEnglish(1234567).value==='one million two hundred thirty-four thousand five hundred sixty-seven');
ok('en negative', A.toEnglish(-42).value==='negative forty-two');
ok('en decimal', A.toEnglish('1234.56').value==='one thousand two hundred thirty-four point five six');
ok('en string', A.toEnglish('100').value==='one hundred');
ok('en invalid', A.toEnglish('abc').error!==undefined);
ok('cn zero', A.toChineseCapital(0).value==='\u96f6\u5143\u6574');
ok('cn 100', A.toChineseCapital(100).value==='\u58f9\u4f70\u5143\u6574');
ok('cn 1234.56', A.toChineseCapital(1234.56).value==='\u58f9\u4edf\u8d30\u4f70\u53c1\u62fe\u8086\u5143\u4f0d\u89d2\u9646\u5206');
ok('cn -50', A.toChineseCapital(-50).value==='\u8d1f\u4f0d\u62fe\u5143\u6574');
ok('cn 0 dec', A.toChineseCapital('0.05').value==='\u96f6\u5143\u96f6\u4f0d\u5206');
ok('cn invalid', A.toChineseCapital('abc').error!==undefined);
console.log('NumeralForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
