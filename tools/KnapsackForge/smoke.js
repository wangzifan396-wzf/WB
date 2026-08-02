
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.KnapsackForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('solve').click();
if(!w.document.getElementById('result').innerHTML.includes('DP 最优')){ console.error('result missing'); process.exit(1); }
if(!w.document.getElementById('table').innerHTML.includes('table')){ console.error('dp table missing'); process.exit(1); }
console.log('PASS smoke');
