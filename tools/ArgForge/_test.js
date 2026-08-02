const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var r=A.parseArgs(['node','--port','8080','--watch','-vxz','file.txt','--no-color','--name=foo'], {skipFirst:true});
ok('skipFirst drops node', r.positionals.indexOf('node')===-1);
ok('option port', r.options.port==='8080');
ok('flag watch', r.flags.watch===true);
ok('short v', r.flags.v===true);
ok('short x', r.flags.x===true);
ok('short z', r.flags.z===true);
ok('no-color false', r.flags.color===false);
ok('name=foo', r.options.name==='foo');
ok('positional file.txt', r.positionals.length===1 && r.positionals[0]==='file.txt');
var r2=A.parseArgs(['app','--verbose','--no-banner'], {skipFirst:false});
ok('no skipFirst keeps app', r2.positionals[0]==='app');
ok('verbose true', r2.flags.verbose===true);
ok('banner false', r2.flags.banner===false);
var r3=A.parseArgs(['x','--key=value','--flag'], {skipFirst:true});
ok('inline equals', r3.options.key==='value');
ok('lone flag true', r3.flags.flag===true);
var r4=A.parseArgs(['x','--dir','/usr/bin'], {skipFirst:true});
ok('value with dash path', r4.options.dir==='/usr/bin');
console.log('ArgForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
