const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// canonical Soundex vectors (US Census / Knuth)
ok('Robert R163', A.sxSoundex('Robert').value==='R163');
ok('Rupert R163', A.sxSoundex('Rupert').value==='R163');
ok('Ashcraft A261', A.sxSoundex('Ashcraft').value==='A261');
ok('Ashcroft A261', A.sxSoundex('Ashcroft').value==='A261');
ok('Tymczak T522', A.sxSoundex('Tymczak').value==='T522');
ok('Pfister P236', A.sxSoundex('Pfister').value==='P236');
ok('Honeyman H555', A.sxSoundex('Honeyman').value==='H555');
ok('Smith=Smyth', A.sxSoundex('Smith').value===A.sxSoundex('Smyth').value);
ok('pad zeros', A.sxSoundex('Lee').value==='L000');
ok('case insensitive', A.sxSoundex('ROBERT').value===A.sxSoundex('robert').value);
ok('empty error', A.sxSoundex('123').error!==null);
// metaphone-lite behaviors
ok('mp PH->F', A.sxMetaphone('Philip').value===A.sxMetaphone('Filip').value);
ok('mp Smith=Smyth', A.sxMetaphone('Smith').value===A.sxMetaphone('Smyth').value);
ok('mp KN drop', A.sxMetaphone('Knight').value[0]==='N');
ok('mp nonempty', A.sxMetaphone('X').value.length>0);
ok('mp error', A.sxMetaphone('!!!').error!==null);
// group
const g=A.sxGroup(['Robert','Rupert','Smith','Smyth'],'soundex');
ok('group two buckets', Object.keys(g.value).length===2);
ok('group R163 pair', g.value['R163'].length===2);
ok('group empty error', A.sxGroup([],'soundex').error!==null);
// match
const m2=A.sxMatch('Smithe',['Smith','Smyth','Johnson'],'soundex');
ok('match finds both', m2.value.matches.length===2);
ok('match code', m2.value.code===A.sxSoundex('Smith').value);
ok('match no hit', A.sxMatch('Zzz',['Smith'],'soundex').value.matches.length===0);
console.log('SoundexForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
