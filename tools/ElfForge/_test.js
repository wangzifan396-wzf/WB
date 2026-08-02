
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const kernel=scripts[0];
const mo={exports:{}};
new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c){pass++;} else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e){pass++;} else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }

// --- 魔数与基本校验 ---
eq('empty', C.parseElf('').value, null);
ok('empty err', /16/.test(C.parseElf('').error));
ok('bad magic', /魔数/.test(C.parseElf('00'.repeat(64)).error));
ok('bad class', /EI_CLASS/.test(C.parseElf('7f454c46 09 01 01 00 '+'00'.repeat(56)).error));
ok('bad data', /EI_DATA/.test(C.parseElf('7f454c46 02 09 01 00 '+'00'.repeat(56)).error));

// --- 构造一个最小 ELF64 LSB DYN x86-64 头 ---
function b64(){
  const b=new Uint8Array(64);
  b[0]=0x7f;b[1]=0x45;b[2]=0x4c;b[3]=0x46;b[4]=2;b[5]=1;b[6]=1;b[7]=0;
  const dv=new DataView(b.buffer);
  dv.setUint16(16,3,true);      // e_type = DYN
  dv.setUint16(18,62,true);     // e_machine = x86-64
  dv.setUint32(20,1,true);
  dv.setUint32(24,0x1030,true); // entry lo
  dv.setUint32(32,0x40,true);   // phoff
  dv.setUint32(40,0x3880,true); // shoff
  dv.setUint16(52,64,true);     // ehsize
  dv.setUint16(54,56,true);     // phentsize
  dv.setUint16(56,13,true);     // phnum
  dv.setUint16(58,64,true);     // shentsize
  dv.setUint16(60,30,true);     // shnum
  dv.setUint16(62,29,true);     // shstrndx
  return b;
}
const r=C.parseElf(b64());
eq('e_class','ELF64',r.value.header.class);
ok('endian LSB', /小端/.test(r.value.header.endian));
ok('type DYN', /DYN/.test(r.value.header.type));
eq('machine','x86-64',r.value.header.machine);
eq('entry',0x1030,r.value.header.entry);
eq('phoff',0x40,r.value.header.phoff);
eq('shoff',0x3880,r.value.header.shoff);
eq('phnum',13,r.value.header.phnum);
eq('shnum',30,r.value.header.shnum);
eq('shstrndx',29,r.value.header.shstrndx);
eq('ehsize',64,r.value.header.ehsize);
eq('osabi','System V',r.value.header.osabi);
ok('truncated flagged', r.value.truncated===true);
eq('no ph parsed',0,r.value.programs.length);

// --- ELF32 大端 EXEC MIPS ---
function b32be(){
  const b=new Uint8Array(52);
  b[0]=0x7f;b[1]=0x45;b[2]=0x4c;b[3]=0x46;b[4]=1;b[5]=2;b[6]=1;b[7]=0;
  const dv=new DataView(b.buffer);
  dv.setUint16(16,2,false);   // EXEC
  dv.setUint16(18,8,false);   // MIPS
  dv.setUint32(24,0x400000,false); // entry
  dv.setUint32(28,52,false);  // phoff
  dv.setUint16(40,52,false);  // ehsize
  dv.setUint16(42,32,false);  // phentsize
  dv.setUint16(44,0,false);
  dv.setUint16(46,40,false);
  dv.setUint16(48,0,false);
  return b;
}
const r2=C.parseElf(b32be());
eq('32 class','ELF32',r2.value.header.class);
ok('32 endian MSB', /大端/.test(r2.value.header.endian));
ok('32 type EXEC', /EXEC/.test(r2.value.header.type));
eq('32 machine','MIPS',r2.value.header.machine);
eq('32 entry',0x400000,r2.value.header.entry);
eq('32 phoff',52,r2.value.header.phoff);
eq('32 ehsize',52,r2.value.header.ehsize);

// --- 带一个 PT_LOAD 程序头的 ELF64 ---
function withPh(){
  const b=new Uint8Array(64+56);
  b.set(b64().subarray(0,64),0);
  const dv=new DataView(b.buffer);
  dv.setUint16(56,1,true);      // phnum = 1
  dv.setUint16(60,0,true);      // shnum = 0
  dv.setUint32(64+0,1,true);    // p_type = LOAD
  dv.setUint32(64+4,5,true);    // flags = R|X
  dv.setUint32(64+8,0,true);    // offset
  dv.setUint32(64+16,0x400000,true); // vaddr
  dv.setUint32(64+32,0x1234,true);   // filesz
  dv.setUint32(64+40,0x2000,true);   // memsz
  dv.setUint32(64+48,0x1000,true);   // align
  return b;
}
const r3=C.parseElf(withPh());
eq('ph count',1,r3.value.programs.length);
eq('ph type','LOAD',r3.value.programs[0].type);
eq('ph flags','R-X',r3.value.programs[0].flags);
eq('ph vaddr',0x400000,r3.value.programs[0].vaddr);
eq('ph filesz',0x1234,r3.value.programs[0].filesz);
eq('ph memsz',0x2000,r3.value.programs[0].memsz);
ok('not truncated', r3.value.truncated===false);

// --- hex 工具 ---
eq('hexToBytes len',4,C.hexToBytes('7f 45 4c 46').length);
eq('hexToBytes v0',0x7f,C.hexToBytes('0x7f,0x45')[0]);
eq('hexToBytes v1',0x45,C.hexToBytes('0x7f,0x45')[1]);
eq('hexToBytes odd trim',1,C.hexToBytes('abc').length);
eq('hx',C.hx(255),'0xff');

console.log((fail?'FAIL':'PASS')+' ElfForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
