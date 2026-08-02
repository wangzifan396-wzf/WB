
const { JSDOM } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true});
const w=dom.window;
if(!w.HashIdForgePure){ console.error('pure missing'); process.exit(1); }
var out=w.document.getElementById('out').innerHTML;
if(out.indexOf('MD5')<0){ console.error('md5 not identified on demo'); process.exit(1); }
w.document.getElementById('src').value='$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
w.document.getElementById('run').click();
if(w.document.getElementById('out').innerHTML.indexOf('bcrypt')<0){ console.error('bcrypt not identified'); process.exit(1); }
console.log('PASS smoke');
process.exit(0);
