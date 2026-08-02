const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('755 to sym', A.octalToSymbolic('755')==='rwxr-xr-x');
ok('644 to sym', A.octalToSymbolic('644')==='rw-r--r--');
ok('600 to sym', A.octalToSymbolic('600')==='rw-------');
ok('777 to sym', A.octalToSymbolic('777')==='rwxrwxrwx');
ok('4755 setuid', A.octalToSymbolic('4755')==='rwsr-xr-x');
ok('2755 setgid', A.octalToSymbolic('2755')==='rwxr-sr-x');
ok('1777 sticky', A.octalToSymbolic('1777')==='rwxrwxrwt');
ok('sym 755', A.symbolicToOctal('rwxr-xr-x')==='755');
ok('sym 644', A.symbolicToOctal('rw-r--r--')==='644');
ok('sym setuid', A.symbolicToOctal('rwsr-xr-x')==='4755');
ok('sym sticky', A.symbolicToOctal('rwxrwxrwt')==='1777');
ok('sym strip type', A.symbolicToOctal('-rwxr-xr-x')==='755');
ok('roundtrip 4755', A.symbolicToOctal(A.octalToSymbolic('4755'))==='4755');
ok('parse owner', A.parsePerms('755').owner.r===true && A.parsePerms('755').owner.w===true);
ok('parse other no w', A.parsePerms('755').other.w===false);
ok('parse setuid', A.parsePerms('4755').setuid===true);
ok('describe has line', A.describe('755').indexOf('所有者')>=0);
ok('invalid octal throws', (function(){ try{ A.octalToSymbolic('89'); return false; }catch(e){ return true; } })());
console.log('ChmodForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
