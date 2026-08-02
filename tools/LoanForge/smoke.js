
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.LoanForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.getElementById('sum').innerHTML.indexOf('月供')<0){ console.error('summary missing'); process.exit(1); }
if(w.document.querySelectorAll('table tr').length<13){ console.error('schedule rows missing'); process.exit(1); }
w.document.getElementById('demo').click();
if(w.document.getElementById('principal').value!=='500000'){ console.error('demo failed'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
