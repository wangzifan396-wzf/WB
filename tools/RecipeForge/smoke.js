
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,url:'https://example.com/'});
const w=dom.window;
if(!w.RecipeForgePure){ console.error('pure missing'); process.exit(1); }
w.document.getElementById('items').value='200 g 面粉\n2 鸡蛋';
w.document.getElementById('from').value='2';
w.document.getElementById('to').value='4';
w.document.getElementById('scale').click();
var out=w.document.getElementById('out').innerHTML;
if(out.indexOf('400 g')<0 || out.indexOf('面粉')<0 || out.indexOf('鸡蛋')<0 || out.indexOf('>4<')<0){ console.error('scale failed: '+out); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
