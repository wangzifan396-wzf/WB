
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }

// ---- CRC16 / LRC 已知向量 ----
eq('crc 0103006B0003', C.crc16(C.hexToBytes('0103006B0003')), 0x1774);
eq('crc 010300000002', C.crc16(C.hexToBytes('010300000002')), 0x0BC4);
eq('crc empty', C.crc16(new Uint8Array(0)), 0xFFFF);
eq('crc single', C.crc16(new Uint8Array([0x02])), 0x813E);
eq('lrc 0103006B0003', C.lrc(C.hexToBytes('0103006B0003')), 0x8E);
eq('lrc zero', C.lrc(new Uint8Array([0])), 0);

// ---- RTU 读保持寄存器请求 ----
let r=C.parse('01 03 00 6B 00 03 74 17','rtu',false);
eq('rtu ok', r.error, '');
eq('rtu unit', r.value.unit, 1);
eq('rtu func', r.value.func, 3);
ok('rtu func name', /读保持寄存器/.test(r.value.funcName));
ok('rtu crc ok', r.value.crcOk===true);
eq('rtu crc given', r.value.crcGiven, '0x1774');
eq('rtu notes', r.value.notes.length, 0);
ok('rtu addr', /^107\b/.test(r.value.fields['起始地址']));
eq('rtu qty', r.value.fields['数量'], 3);
eq('rtu pdu', r.value.pdu, '03 00 6B 00 03');

// CRC 错误
r=C.parse('01 03 00 6B 00 03 74 18','rtu',false);
ok('rtu crc bad', r.value.crcOk===false);
ok('rtu crc note', /CRC16 不匹配/.test(r.value.notes.join('|')));

// 广播地址 / 超范围地址
ok('broadcast note', /广播地址/.test(C.parse(C.toHex(C.buildRtu(0,3,[0,1,0,1])),'rtu',false).value.notes.join('|')));
ok('addr range note', /超出 1\.\.247/.test(C.parse(C.toHex(C.buildRtu(250,3,[0,1,0,1])),'rtu',false).value.notes.join('|')));

// ---- RTU 响应 ----
r=C.parse(C.toHex(C.buildRtu(1,3,[6, 0x02,0x2B, 0x00,0x00, 0x00,0x64])),'rtu',true);
eq('res ok', r.error, '');
eq('res bytecount', r.value.fields['字节数'], 6);
eq('res regs', r.value.fields['寄存器值'], '555, 0, 100');
eq('res regs arr', r.value.fields.__regs.length, 3);
eq('res no warn', r.value.notes.length, 0);

// 字节数声明错误
r=C.parse(C.toHex(C.buildRtu(1,3,[8, 0x00,0x01])),'rtu',true);
ok('res bytecount warn', /声明 8/.test(r.value.fields['⚠ 字节数']));

// ---- 异常响应 ----
r=C.parse(C.toHex(C.buildRtu(1,0x83,[2])),'rtu',true);
ok('exception flag', r.value.isException===true);
eq('exception code', r.value.exceptionCode, 2);
ok('exception text', /非法数据地址/.test(r.value.fields['异常码']));
ok('exception orig', /读保持寄存器/.test(r.value.fields['原功能码']));

// ---- 写单线圈 / 写单寄存器 ----
r=C.parse(C.toHex(C.buildRtu(17,5,[0x00,0xAC,0xFF,0x00])),'rtu',false);
eq('coil addr', r.value.fields['线圈地址'], 172);
eq('coil on', r.value.fields['写入值'], 'ON (0xFF00)');
r=C.parse(C.toHex(C.buildRtu(17,5,[0x00,0xAC,0x00,0x00])),'rtu',false);
eq('coil off', r.value.fields['写入值'], 'OFF (0x0000)');
r=C.parse(C.toHex(C.buildRtu(17,5,[0x00,0xAC,0x12,0x34])),'rtu',false);
ok('coil illegal', /非法/.test(r.value.fields['写入值']));
r=C.parse(C.toHex(C.buildRtu(17,6,[0x00,0x01,0x00,0x03])),'rtu',false);
eq('wreg addr', r.value.fields['寄存器地址'], 1);
ok('wreg val', /^3\b/.test(r.value.fields['写入值']));

// ---- 写多线圈 / 写多寄存器 ----
r=C.parse(C.toHex(C.buildRtu(1,15,[0x00,0x13,0x00,0x0A,0x02,0xCD,0x01])),'rtu',false);
eq('mcoil start', r.value.fields['起始地址'], 19);
eq('mcoil qty', r.value.fields['线圈数量'], 10);
eq('mcoil bits', r.value.fields['线圈值'], '1011001110');
ok('mcoil no warn', r.value.fields['⚠ 字节数']===undefined);
r=C.parse(C.toHex(C.buildRtu(1,15,[0x00,0x13,0x00,0x0A,0x03,0xCD,0x01,0x00])),'rtu',false);
ok('mcoil bytecount warn', /应为 2/.test(r.value.fields['⚠ 字节数']));
r=C.parse(C.toHex(C.buildRtu(1,16,[0x00,0x01,0x00,0x02,0x04,0x00,0x0A,0x01,0x02])),'rtu',false);
eq('mreg qty', r.value.fields['寄存器数量'], 2);
eq('mreg vals', r.value.fields['寄存器值'], '10, 258');

// ---- 屏蔽写 / 读写多寄存器 ----
r=C.parse(C.toHex(C.buildRtu(1,22,[0x00,0x04,0x00,0xF2,0x00,0x25])),'rtu',false);
eq('mask and', r.value.fields['与掩码 AND'], '0xF2');
eq('mask or', r.value.fields['或掩码 OR'], '0x25');
r=C.parse(C.toHex(C.buildRtu(1,23,[0,3,0,6,0,0x0E,0,3,6,0,0xFF,0,0xFF,0,0xFF])),'rtu',false);
eq('rw read qty', r.value.fields['读数量'], 6);
eq('rw write start', r.value.fields['写起始地址'], 14);

// ---- 数量范围校验 ----
r=C.parse(C.toHex(C.buildRtu(1,3,[0,0,0,200])),'rtu',false);
ok('qty limit reg', /1\.\.125/.test(r.value.fields['⚠ 数量范围']));
r=C.parse(C.toHex(C.buildRtu(1,1,[0,0,0x07,0xD0])),'rtu',false);   // 2000 线圈：上限内
ok('qty limit coil ok', r.value.fields['⚠ 数量范围']===undefined);
r=C.parse(C.toHex(C.buildRtu(1,1,[0,0,0x07,0xD1])),'rtu',false);   // 2001：越界
ok('qty limit coil bad', /1\.\.2000/.test(r.value.fields['⚠ 数量范围']));
r=C.parse(C.toHex(C.buildRtu(1,3,[0,0,0,0])),'rtu',false);          // 0 个寄存器：越界
ok('qty zero bad', /1\.\.125/.test(r.value.fields['⚠ 数量范围']));

// ---- TCP ----
r=C.parse('00 01 00 00 00 06 01 03 00 6B 00 03','tcp',false);
eq('tcp ok', r.error, '');
eq('tcp tid', r.value.mbap.transaction, 1);
eq('tcp proto', r.value.mbap.protocol, 0);
eq('tcp len', r.value.mbap.length, 6);
eq('tcp unit', r.value.unit, 1);
eq('tcp qty', r.value.fields['数量'], 3);
eq('tcp notes', r.value.notes.length, 0);
r=C.parse('00 01 00 01 00 06 01 03 00 6B 00 03','tcp',false);
ok('tcp proto warn', /协议标识应为 0/.test(r.value.notes.join('|')));
r=C.parse('00 01 00 00 00 09 01 03 00 6B 00 03','tcp',false);
ok('tcp len warn', /长度字段 9/.test(r.value.notes.join('|')));
eq('buildTcp bytes', C.toHex(C.buildTcp(1,1,3,[0,0x6B,0,3])), '00 01 00 00 00 06 01 03 00 6B 00 03');

// ---- ASCII ----
{
  const frame=C.buildAscii(1,3,[0x00,0x6B,0x00,0x03]);
  ok('ascii starts colon', frame.charAt(0)===':');
  ok('ascii crlf', /\r\n$/.test(frame));
  const rr=C.parse(frame,'ascii',false);
  eq('ascii ok', rr.error, '');
  eq('ascii unit', rr.value.unit, 1);
  eq('ascii qty', rr.value.fields['数量'], 3);
  eq('ascii notes', rr.value.notes.length, 0);
  const bad=frame.replace(/..\r\n$/, 'FF\r\n');
  ok('ascii lrc warn', /LRC 不匹配/.test(C.parse(bad,'ascii',false).value.notes.join('|')));
  ok('ascii no colon', /必须以 : 开头/.test(C.parse('0103006B0003BE','ascii',false).error));
  ok('ascii odd', /奇数/.test(C.parse(':010\r\n','ascii',false).error));
}

// ---- 构建 API ----
eq('readRequest rtu', C.toHex(C.readRequest(1,3,107,3,'rtu')), '01 03 00 6B 00 03 74 17');
ok('readRequest ascii', /^:0103006B0003/.test(C.readRequest(1,3,107,3,'ascii')));
eq('bits helper', C.bitsFromBytes(new Uint8Array([0xCD]),8).join(''), '10110011');

// ---- 错误路径 ----
ok('empty', /输入为空/.test(C.parse('','rtu',false).error));
ok('too short', /帧过短|至少需要/.test(C.parse('01','rtu',false).error));
ok('rtu min', /至少需要 4 字节/.test(C.parse('010300','rtu',false).error));
ok('tcp min', /至少需要 7 字节/.test(C.parse('00 01 00 00 00 06 01','tcp',false).error));
r=C.parse(C.toHex(C.buildRtu(1,99,[1,2])),'rtu',false);
ok('unknown func', /未知功能码 99/.test(r.value.funcName));

console.log((fail?'FAIL':'PASS')+' ModbusForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
