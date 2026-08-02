const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('visa valid', A.luhnValidate('4111111111111111')===true);
ok('visa spaces', A.luhnValidate('4111 1111 1111 1111')===true);
ok('invalid', A.luhnValidate('4111111111111112')===false);
ok('mc valid', A.luhnValidate('5500005555555559')===true);
ok('amex valid', A.luhnValidate('378282246310005')===true);
ok('check digit', A.luhnCheckDigit('411111111111111')==='1');
ok('check digit 79927398713', A.luhnCheckDigit('7992739871')==='3');
ok('brand visa', A.cardBrand('4111111111111111')==='Visa');
ok('brand mc', A.cardBrand('5500005555555559')==='Mastercard');
ok('brand amex', A.cardBrand('378282246310005')==='American Express');
ok('brand unionpay', A.cardBrand('6212345678901232')==='UnionPay 银联');
ok('brand unknown', A.cardBrand('9999999999999999')==='未知卡组织');
ok('format', A.formatCard('4111111111111111')==='4111 1111 1111 1111');
ok('clean dashes', A.luhnClean('4111-1111')==='41111111');
ok('bad chars throws', (function(){try{A.luhnClean('41x1');return false;}catch(e){return true;}})());
ok('short throws', (function(){try{A.luhnValidate('1');return false;}catch(e){return true;}})());
console.log('LuhnForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
