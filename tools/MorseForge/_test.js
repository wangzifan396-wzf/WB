const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('SOS encode', A.toMorse('SOS')==='... --- ...');
ok('HELLO encode', A.toMorse('HELLO')==='.... . .-.. .-.. ---');
ok('two words', A.toMorse('HI YOU')==='.... .. / -.-- --- ..-');
ok('digits', A.toMorse('2024')==='..--- ----- ..--- ....-');
ok('lowercase ok', A.toMorse('sos')==='... --- ...');
ok('decode SOS', A.fromMorse('... --- ...')==='SOS');
ok('decode words', A.fromMorse('.... .. / -.-- --- ..-')==='HI YOU');
ok('decode punct', A.fromMorse('.-.-.-')==='.');
ok('roundtrip', A.fromMorse(A.toMorse('HELLO WORLD 123'))==='HELLO WORLD 123');
ok('isMorse yes', A.isMorse('... --- ...')===true);
ok('isMorse no', A.isMorse('HELLO')===false);
ok('bad char throws', (function(){try{A.toMorse('你好');return false;}catch(e){return true;}})());
ok('bad seq throws', (function(){try{A.fromMorse('......--');return false;}catch(e){return true;}})());
console.log('MorseForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
