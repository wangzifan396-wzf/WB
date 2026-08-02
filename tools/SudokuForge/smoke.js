
const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom = new JSDOM(html, { runScripts:'dangerously', resources:'usable' });
const w = dom.window;
if(!w.SudokuForgePure){ console.error('pure missing'); process.exit(1); }
var inputs=w.document.querySelectorAll('#board input');
if(inputs.length!==81){ console.error('board not 81 cells: '+inputs.length); process.exit(1); }
w.document.getElementById('solve').click();
var filled=w.document.querySelectorAll('#board input').length;
if(filled!==81){ console.error('not rendered after solve'); process.exit(1); }
console.log('PASS smoke');
