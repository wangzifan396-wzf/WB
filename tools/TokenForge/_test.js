const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('empty tokens', A.countTokens('')===0);
ok('word hello=2 chunks', A.countTokens('hello')===2);
ok('hello world=5 tokens', A.countTokens('hello world')===5);
ok('breakdown chars', A.breakdown('ab').chars===2);
ok('breakdown tokens', A.breakdown('hello world').estTokens===5);
var c=A.estimateCost('hello world','gpt-4o-mini');
ok('cost tokens=5', c.tokens===5);
ok('cost input', Math.abs(c.inputCost - 5*0.15/1e6) < 1e-12);
ok('cost output', Math.abs(c.outputCost - 5*0.60/1e6) < 1e-12);
ok('unknown model throws', (function(){try{A.estimateCost('x','nope');return false;}catch(e){return e.message==='UNKNOWN_MODEL';}})());
ok('tokenize deterministic', JSON.stringify(A.tokenize('Hello'))==='["hell","o"]');
ok('punctuation separate token', A.countTokens('a.b')===3);
ok('PRICING has 5 models', Object.keys(A.PRICING).length===5);
console.log('TokenForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
