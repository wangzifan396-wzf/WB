// TimeForge pure function tests (Node, no deps)
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const P = mod.exports;

let pass = 0, fail = 0;
function t(name, cond) {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.error('  FAIL', name); }
}

// normalizeTimestamp
t('ts seconds', JSON.stringify(P.normalizeTimestamp('1753500000')) === JSON.stringify({ ms: 1753500000000, unit: 's' }));
t('ts millis', JSON.stringify(P.normalizeTimestamp('1753500000000')) === JSON.stringify({ ms: 1753500000000, unit: 'ms' }));
t('ts trims', P.normalizeTimestamp('  1753500000  ').unit === 's');
t('ts rejects text', P.normalizeTimestamp('abc') === null);
t('ts rejects float', P.normalizeTimestamp('17535.5') === null);
t('ts rejects huge', P.normalizeTimestamp('9'.repeat(16)) === null);
t('ts zero', P.normalizeTimestamp('0').ms === 0);

// formatInZone (2026-07-26 04:00:00 UTC = 1784952000000? use known: 0 = 1970-01-01)
t('format epoch utc', P.formatInZone(0, 0) === '1970-01-01 00:00:00');
t('format epoch +8', P.formatInZone(0, 480) === '1970-01-01 08:00:00');
t('format epoch -5', P.formatInZone(0, -300) === '1969-12-31 19:00:00');
t('weekday epoch', P.weekdayInZone(0, 0) === '周四');

// isoInZone
t('iso +8', P.isoInZone(0, 480) === '1970-01-01T08:00:00+08:00');
t('iso -5', P.isoInZone(0, -300) === '1969-12-31T19:00:00-05:00');

// parseDateTimeInZone (roundtrip)
const ms = P.parseDateTimeInZone('2026-07-26 13:00:00', 480);
t('parse +8', ms === Date.UTC(2026, 6, 26, 5, 0, 0));
t('parse roundtrip', P.formatInZone(ms, 480) === '2026-07-26 13:00:00');
t('parse T sep', P.parseDateTimeInZone('2026-07-26T13:00', 0) === Date.UTC(2026, 6, 26, 13, 0, 0));
t('parse bad', P.parseDateTimeInZone('not a date', 0) === null);

// dateDiff
const d = P.dateDiff(0, 90061000); // 1d 1h 1m 1s
t('diff days', d.days === 1 && d.hours === 1 && d.minutes === 1 && d.seconds === 1);
t('diff totals', d.totalHours === 25 && d.totalDays === 1);
t('diff abs', P.dateDiff(90061000, 0).totalMs === 90061000);

// humanizeDuration
t('human 0', P.humanizeDuration(500) === '不到 1 秒');
t('human 90s', P.humanizeDuration(90000) === '1 分 30 秒');
t('human 1d1h', P.humanizeDuration(90000000) === '1 天 1 小时');

// leap year / daysInMonth
t('leap 2024', P.isLeapYear(2024) === true);
t('leap 1900', P.isLeapYear(1900) === false);
t('leap 2000', P.isLeapYear(2000) === true);
t('feb 2024', P.daysInMonth(2024, 2) === 29);
t('feb 2026', P.daysInMonth(2026, 2) === 28);
t('jul days', P.daysInMonth(2026, 7) === 31);

// zones
t('zones list', Array.isArray(P.ZONES) && P.ZONES.length === 6 && P.ZONES[0].offset === 480);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
