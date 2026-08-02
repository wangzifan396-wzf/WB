// SubnetForge _test.js
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script>'); process.exit(1); }
let mod = { exports: {} };
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;

let pass=0, fail=0;
function ok(n,c){ if(c){pass++;console.log('PASS',n);} else {fail++;console.error('FAIL',n);} }

ok('isIpv4 valid', P.isIpv4('192.168.1.1')===true);
ok('isIpv4 invalid', P.isIpv4('256.1.1.1')===false);
ok('ipv4ToLong', P.ipv4ToLong('192.168.1.1')===3232235777);
ok('longToIpv4 round-trip', P.longToIpv4(3232235777)==='192.168.1.1');
ok('cidrToMask(24)', P.cidrToMask(24)==='255.255.255.0');
ok('maskToPrefix', P.maskToPrefix('255.255.255.0')===24);

const p = P.parseCIDR('192.168.1.0/24');
ok('parseCIDR network', p.network==='192.168.1.0');
ok('parseCIDR broadcast', p.broadcast==='192.168.1.255');
ok('parseCIDR usable 254', p.usableHosts===254);
ok('parseCIDR firstUsable', p.firstUsable==='192.168.1.1');
ok('parseCIDR lastUsable', p.lastUsable==='192.168.1.254');

ok('isInSubnet true', P.isInSubnet('192.168.1.100','192.168.1.0/24')===true);
ok('isInSubnet false', P.isInSubnet('10.0.0.1','192.168.1.0/24')===false);

const sp = P.splitSubnet('192.168.1.0/24',25);
ok('splitSubnet count 2', sp.length===2);
ok('splitSubnet first', sp[0]==='192.168.1.0/25');

const p30 = P.parseCIDR('10.0.0.0/30');
ok('/30 usable 2', p30.usableHosts===2 && p30.firstUsable==='10.0.0.1' && p30.lastUsable==='10.0.0.2');

ok('expandV6', P.expandV6('2001:db8::')==='2001:0db8:0000:0000:0000:0000:0000:0000');
ok('compress+expand round-trip', P.expandV6(P.bigToIpv6(P.ipv6ToBig('2001:db8::1')))==='2001:0db8:0000:0000:0000:0000:0000:0001');

const p6 = P.parseCIDR6('2001:db8::/32');
ok('parseCIDR6 network', p6.network==='2001:0db8:0000:0000:0000:0000:0000:0000');
ok('parseCIDR6 mask hex', p6.maskHex==='ffff:ffff:0000:0000:0000:0000:0000:0000');

ok('isInSubnet6 true', P.isInSubnet6('2001:db8:1234::1','2001:db8::/32')===true);
ok('isInSubnet6 false', P.isInSubnet6('2001:db9::1','2001:db8::/32')===false);

console.log('\n'+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
