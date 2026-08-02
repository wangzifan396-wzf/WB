
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }
function near(n,g,e,tol){ if(Math.abs(g-e)<=(tol||1e-6)) pass++; else {fail++;console.error('FAIL '+n+': got '+g+' want ~'+e);} }

// ---- 校验和 ----
eq('cksum GGA', C.checksum('GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,'), '47');
eq('cksum RMC', C.checksum('GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W'), '6A');
eq('cksum pad', C.checksum('A'), '41');
eq('build', C.build('GPGGA,1'), '$GPGGA,1*'+C.checksum('GPGGA,1'));
eq('build strips old', C.build('$GPGGA,1*FF'), '$GPGGA,1*'+C.checksum('GPGGA,1'));

// ---- 坐标转换 ----
near('coord lat N', C.coord('4807.038','N'), 48.1173, 1e-4);
near('coord lon E', C.coord('01131.000','E'), 11.5166667, 1e-6);
near('coord S negative', C.coord('4807.038','S'), -48.1173, 1e-4);
near('coord W negative', C.coord('01131.000','W'), -11.5166667, 1e-6);
eq('coord empty', C.coord('','N'), null);
eq('coord bad minutes', C.coord('4867.000','N'), null);
eq('dms lat', C.dms(48.1173, true), '48° 7\' 2.28" N');
eq('dms lon west', C.dms(-11.5166667, false), '11° 31\' 0.00" W');
eq('dms lon east', C.dms(11.51, false), '11° 30\' 36.00" E');
eq('dms null', C.dms(null,true), '—');
eq('utc', C.utc('123519'), '12:35:19');
eq('utc frac', C.utc('123519.50'), '12:35:19.50');
eq('dmy 1994', C.dmy('230394'), '1994-03-23');
eq('dmy 2021', C.dmy('010121'), '2021-01-01');
eq('dmy bad', C.dmy('123'), null);

// ---- GGA ----
let r=C.parseLine('$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47');
ok('gga ok', r.ok);
eq('gga type', r.type, 'GGA');
eq('gga talker', r.talkerName, 'GPS');
eq('gga time', r.data['UTC 时间'], '12:35:19');
near('gga lat', r.data['纬度'], 48.1173, 1e-4);
eq('gga fix', r.data['定位质量'], 'GPS 单点 (1)');
eq('gga sats', r.data['使用卫星数'], 8);
eq('gga hdop', r.data['水平精度因子 HDOP'], 0.9);
eq('gga alt', r.data['海拔'], '545.4 M');

// ---- RMC ----
r=C.parseLine('$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A');
ok('rmc ok', r.ok);
eq('rmc status', r.data['状态'], '有效');
eq('rmc date', r.data['日期'], '1994-03-23');
ok('rmc speed kmh', /41\.48 km\/h/.test(r.data['对地速度']));
eq('rmc course', r.data['航向'], '84.4°');

// ---- GSA / GSV / VTG / GLL / ZDA ----
r=C.parseLine('$GPGSA,A,3,04,05,,09,12,,,24,,,,,2.5,1.3,2.1*39');
ok('gsa ok', r.ok);
eq('gsa dim', r.data['定位维度'], '3D');
eq('gsa prns', r.data['参与解算 PRN'], '04, 05, 09, 12, 24');
eq('gsa pdop', r.data['PDOP'], 2.5);

r=C.parseLine('$GPGSV,2,1,08,01,40,083,46,02,17,308,41,12,07,344,39,14,22,228,45*75');
ok('gsv ok', r.ok);
eq('gsv total', r.data['可见卫星总数'], 8);
eq('gsv sat count', r.data.__sats.length, 4);
eq('gsv sat0 snr', r.data.__sats[0].snr, 46);
eq('gsv sat3 prn', r.data.__sats[3].prn, '14');

r=C.parseLine('$GPVTG,054.7,T,034.4,M,005.5,N,010.2,K*48');
ok('vtg ok', r.ok);
eq('vtg true', r.data['真北航向'], '54.7°');
eq('vtg kmh', r.data['速度(km/h)'], 10.2);

r=C.parseLine('$GPGLL,4916.45,N,12311.12,W,225444,A*31');
ok('gll ok', r.ok);
eq('gll status', r.data['状态'], '有效');
near('gll lon', r.data['经度'], -123.1853333, 1e-6);

r=C.parseLine('$GPZDA,201530.00,04,07,2002,00,00*60');
ok('zda ok', r.ok);
eq('zda date', r.data['日期'], '2002-07-04');

// ---- 多星座 talker ----
r=C.parseLine('$GNGGA,001043.00,4404.14036,N,12118.85961,W,1,12,0.98,1113.0,M,-21.3,M,,*47');
eq('gn talker', r.talkerName, '多星座组合');
r=C.parseLine(C.build('GBGSV,1,1,01,01,40,083,46'));
eq('gb talker', r.talkerName, 'BeiDou');

// ---- 厂商专有 ----
r=C.parseLine(C.build('PUBX,00,081350.00,4717.113210,N,00833.915187,E'));
eq('proprietary talker', r.talkerName, '厂商专有');
eq('proprietary type', r.type, 'UBX');
ok('proprietary ok', r.ok);

// ---- 错误路径 ----
r=C.parseLine('GPGGA,1*00');
ok('no dollar', /\$ 或 !/.test(r.error));
r=C.parseLine('$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*48');
ok('bad checksum', /校验和不匹配/.test(r.error));
ok('bad checksum not ok', !r.ok);
r=C.parseLine('$GPGGA,123519');
ok('missing star', /缺少 \* 校验和/.test(r.error));
r=C.parseLine('$GPGGA,1*ZZ');
ok('bad checksum format', /校验和格式非法/.test(r.error));
r=C.parseLine(C.build('XY,1'));
ok('bad address', /不符合 5 字符规范/.test(r.error));
{
  const long='$GPTXT,'+'A'.repeat(90);
  const s=C.build(long);
  const rr=C.parseLine(s);
  ok('too long', /82 字符上限/.test(rr.error));
}
r=C.parseLine('!AIVDM,1,1,,A,13HOI:0P0000VOHLCnHQKwvL05Ip,0*23');
eq('encapsulated talker', r.talkerName, 'AIS');
ok('encapsulated flag', r.encapsulated===true);

// ---- 批量解析 ----
{
  const txt=['$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47',
             '',
             '$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A',
             '$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*00'].join('\n');
  const rr=C.parse(txt);
  eq('batch count', rr.value.sentences.length, 3);
  eq('batch ok', rr.value.ok, 2);
  eq('batch bad', rr.value.bad, 1);
  near('batch pos lat', rr.value.position.lat, 48.1173, 1e-4);
  eq('batch sats', rr.value.satellites, 8);
  ok('batch fix', /GPS 单点/.test(rr.value.fix));
}
ok('empty batch', /没有可解析的语句/.test(C.parse('  \n ').error));

console.log((fail?'FAIL':'PASS')+' NmeaForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
