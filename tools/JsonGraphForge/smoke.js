
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.JsonGraphForgePure){ console.error('pure missing'); process.exit(1); }
if(!/^\s*<svg/.test(w.document.getElementById('cv').innerHTML)){ console.error('graph not rendered'); process.exit(1); }
console.log('PASS smoke');
