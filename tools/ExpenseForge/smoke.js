
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,url:'https://example.com/'});
const w=dom.window;
if(!w.ExpenseForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('amount').value='50';
w.document.getElementById('cat').value='餐饮';
w.document.getElementById('date').value='2026-07-30';
w.document.getElementById('note').value='午饭';
w.document.getElementById('add').click();
if(w.document.getElementById('total').textContent.indexOf('50.00')<0){ console.error('total wrong'); process.exit(1); }
if(!w.localStorage.getItem('expense_list')){ console.error('not persisted'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
