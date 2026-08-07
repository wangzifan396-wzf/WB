const { JSDOM, VirtualConsole } = require('jsdom');
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const errors=[];
const vc=new VirtualConsole();
vc.on('jsdomError', function(e){ errors.push((e&&e.message)||String(e)); });
const dom=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true, url:'https://example.com/', virtualConsole:vc});
const w=dom.window;
if(!w.KinematicsForgePure){ console.error('pure missing'); process.exit(1); }
if(w.document.body.innerHTML.indexOf('匀加速直线运动')<0){ console.error('initial output missing'); process.exit(1); }
// 捕获 UI 运行时错误（ReferenceError/TypeError 等真实代码缺陷）。
// jsdom 无 WebCrypto，crypto 类工具在 init 阶段会抛 subtle/generateKey 类错误，属环境限制，放行。
setTimeout(function(){
  var code=errors.filter(function(m){
    if(/crypto|subtle|getRandomValues|generateKey|importKey|deriveKey|encrypt|decrypt|sign|verify|digest|randomUUID|getRandom/i.test(m)) return false;
    return /is not defined|Cannot read|TypeError|ReferenceError|SyntaxError|is not a function|undefined \(reading/.test(m);
  });
  if(code.length){ console.error('UI runtime error(s):'); code.forEach(function(m){console.error('  '+m);}); process.exit(1); }
  console.log('PASS smoke'); process.exit(0);
}, 400);
