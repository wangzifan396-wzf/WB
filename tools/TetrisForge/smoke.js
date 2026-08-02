
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.TetrisForgePure){ console.error('pure missing'); process.exit(1); }
// simulate left move + rotate via keydown
var ev=new w.KeyboardEvent('keydown',{key:'ArrowLeft'});
w.document.dispatchEvent(ev);
w.document.getElementById('reset').click();
console.log('PASS smoke');
process.exit(0);
