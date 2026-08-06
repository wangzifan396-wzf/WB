
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var em=A.maskEmail('alice@example.com'); ok('email masked', /^a\*+@e\*+$/.test(em) && em.indexOf('@')>0);
var ph=A.maskPhone('13812345678'); ok('phone stars', /^\*{7}5678$/.test(ph));
var card=A.maskCard('4111111111111111'); ok('card stars', /^\*{12}1111$/.test(card));
var id=A.maskId('110101199003078888'); ok('id stars', /^110101\*{8}8888$/.test(id));
var txt=A.maskText('联系 alice@example.com 或 13812345678'); ok('text masked', /\*{7}5678/.test(txt) && txt.indexOf('alice')<0);
console.log('MaskForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
