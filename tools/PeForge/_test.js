
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }
const PE='4d5a90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000005045000064860200000000600000000000000000f00022000b020e1d000400000002000000000000001000000010000000000040010000000010000000020000060000000000000006000000000000000030000000040000000000000300608100001000000000000010000000000000000010000000000000100000000000000000000010000000000000000000000000210000500000000000000000000000000000000000000000000000000000000000000000000000002200001c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e7465787400000050030000001000000004000000040000000000000000000000000000200000602e726461746100002001000000200000000200000008000000000000000000000000000040000040';

// ---- 基本结构 ----
let r=C.parse(PE);
eq('parse ok', r.error, '');
eq('lfanew', r.value.lfanew, 0x40);
eq('lfanew hex', r.value.lfanewHex, '0x00000040');
eq('kind', r.value.kind, 'EXE');
eq('file size', r.value.fileSize, PE.length/2);

// ---- COFF ----
const c=r.value.coff;
eq('machine', c.machine, 0x8664);
eq('machine name', c.machineName, 'x64 (AMD64)');
eq('sections count', c.sections, 2);
eq('opt size', c.optSize, 240);
ok('char exec', c.flags.indexOf('EXECUTABLE_IMAGE')>=0);
ok('char laa', c.flags.indexOf('LARGE_ADDRESS_AWARE')>=0);
ok('not dll', c.flags.indexOf('DLL')<0);
ok('time iso', /^1610612736\s+2021-01-14T/.test(c.time));

// ---- Optional ----
const o=r.value.opt;
eq('magic', o.magic, 0x20B);
eq('kind pe32+', o.kind, 'PE32+');
eq('linker', o.linker, '14.29');
eq('entry', o.entryPoint, 0x1000);
eq('image base', o.imageBase, '0x0000000140000000');
eq('sec align', o.sectionAlignment, 0x1000);
eq('file align', o.fileAlignment, 0x200);
eq('size of image', o.sizeOfImage, 0x3000);
eq('size of headers', o.sizeOfHeaders, 0x400);
eq('subsystem', o.subsystem, 3);
eq('subsystem name', o.subsystemName, 'WINDOWS_CUI');
eq('subsys ver', o.subsystemVersion, '6.0');
eq('stack reserve', o.stackReserve, 0x100000);
eq('heap commit', o.heapCommit, 0x1000);
eq('rva count', o.numberOfRvaAndSizes, 16);
ok('nx flag', o.dllFlags.indexOf('NX_COMPAT (DEP)')>=0);
ok('aslr flag', o.dllFlags.indexOf('DYNAMIC_BASE (ASLR)')>=0);
ok('high entropy', o.dllFlags.indexOf('HIGH_ENTROPY_VA')>=0);
ok('no guard cf', o.dllFlags.indexOf('GUARD_CF')<0);
eq('dirs used', o.dirs.length, 2);
eq('dir1 name', o.dirs[0].name, 'Import');
eq('dir1 rva', o.dirs[0].rva, '0x00002100');
eq('dir2 name', o.dirs[1].name, 'Debug');
eq('dir2 size', o.dirs[1].size, 0x1C);

// ---- Sections ----
const s=r.value.sections;
eq('sec len', s.length, 2);
eq('sec0 name', s[0].name, '.text');
eq('sec0 rva', s[0].rvaHex, '0x00001000');
eq('sec0 vsize', s[0].virtualSize, 0x350);
ok('sec0 code', s[0].flags.indexOf('CODE')>=0);
ok('sec0 exec', s[0].flags.indexOf('EXECUTE')>=0);
ok('sec0 read', s[0].flags.indexOf('READ')>=0);
ok('sec0 not write', s[0].flags.indexOf('WRITE')<0);
eq('sec1 name', s[1].name, '.rdata');
ok('sec1 initdata', s[1].flags.indexOf('INITIALIZED_DATA')>=0);
ok('sec0 truncated (headers only)', s[0].truncated===true);

// ---- 告警 ----
const W=r.value.warnings.join(' | ');
ok('no wx warn', W.indexOf('W^X')<0);
ok('no nx warn', W.indexOf('NX_COMPAT')<0);

// ---- 错误路径 ----
ok('empty', /输入为空/.test(C.parse('').error));
ok('short', /文件过短/.test(C.parse('4d5a').error));
ok('no mz', /DOS 魔数/.test(C.parse('00'.repeat(64)).error));
ok('bad lfanew', /指向文件外/.test(C.parse('4d5a'+'00'.repeat(58)+'ffffff7f'+'00'.repeat(2)).error));
{
  let bad = PE.slice(0, 0x40*2) + '50450100' + PE.slice(0x44*2);
  ok('no pe sig', /不是 PE/.test(C.parse(bad).error));
}
{ // 篡改为 DLL + 可写可执行节
  let hexArr = PE.match(/../g);
  hexArr[0x40+4+18] = '22';  // characteristics lo
  hexArr[0x40+4+19] = '20';  // +0x2000 DLL
  let mod = hexArr.join('');
  let rr = C.parse(mod);
  ok('dll detected', rr.value.coff.flags.indexOf('DLL')>=0);
  eq('kind dll', rr.value.kind, 'DLL');
}
{ // machine 未知
  let hexArr = PE.match(/../g);
  hexArr[0x44]='99'; hexArr[0x45]='99';
  let rr=C.parse(hexArr.join(''));
  ok('unknown machine', /未知/.test(rr.value.coff.machineName));
}
{ // 关闭 DEP/ASLR 触发告警
  let hexArr = PE.match(/../g);
  const dllcOff = 0x40+4+20+70;  // optional header + 70 = DllCharacteristics
  hexArr[dllcOff]='00'; hexArr[dllcOff+1]='00';
  let rr=C.parse(hexArr.join(''));
  const w=rr.value.warnings.join(' | ');
  ok('nx warn fires', /NX_COMPAT/.test(w));
  ok('aslr warn fires', /DYNAMIC_BASE/.test(w));
}

// ---- 辅助函数 ----
eq('flags helper', C.flags(C.SECF, 0x60000020).join(','), 'CODE,EXECUTE,READ');
eq('stamp zero', C.stamp(0), '0 (未设置)');
ok('stamp future', /Reproducible/.test(C.stamp(5000000000)));
eq('hexToBytes', C.hexToBytes('4d 5a').length, 2);

console.log((fail?'FAIL':'PASS')+' PeForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
