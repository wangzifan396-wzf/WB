// SubnetForge smoke.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let pass=0, fail=0;
function ok(n,c){ if(c){pass++;console.log('PASS',n);} else {fail++;console.error('FAIL',n);} }

const dom = new JSDOM(html, { runScripts:'dangerously', url:'http://localhost/' });
const doc = dom.window.document;
ok('calc button present', !!doc.getElementById('calc'));
ok('cidr input present', !!doc.getElementById('cidr'));

// default 192.168.1.0/24 should render broadcast 192.168.1.255
const out = doc.getElementById('out').textContent;
ok('output shows broadcast', /192\.168\.1\.255/.test(out));
ok('output shows usable 254', /254/.test(out));

// split /24 -> /25
doc.getElementById('nprefix').value='25';
doc.getElementById('split').click();
const splitItems = doc.querySelectorAll('#splitOut div');
ok('split produced 2 subnets', splitItems.length===2);

// belongs check
doc.getElementById('ipchk').value='192.168.1.50';
doc.getElementById('cidrchk').value='192.168.1.0/24';
doc.getElementById('belongs').click();
ok('belongs reports true', /属于/.test(doc.getElementById('belongsRes').textContent));

console.log('\n'+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
