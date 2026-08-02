
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.TokenizeForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('run').click();
if(!w.document.getElementById('tokensOut').innerHTML.includes('span')){ console.error('no tokens rendered'); process.exit(1); }
console.log('PASS smoke');
