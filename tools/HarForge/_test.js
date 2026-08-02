
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('bytes-b', C.fmtBytes(512)==='512 B');
ok('bytes-kb', C.fmtBytes(2048)==='2 KB');
ok('bytes-mb', C.fmtBytes(1572864)==='1.5 MB');
ok('bytes-bad', C.fmtBytes(-1)==='-');
ok('ms', C.fmtMs(320)==='320 ms');
ok('ms-s', C.fmtMs(1500)==='1.5 s');
ok('host', C.hostOf('https://a.b.com/x?y=1')==='a.b.com');
ok('host-rel', C.hostOf('/x')==='(相对路径)');
ok('type-js', C.typeOf('application/javascript','')==='JS');
ok('type-css', C.typeOf('text/css','')==='CSS');
ok('type-img', C.typeOf('image/png','')==='图片');
ok('type-font', C.typeOf('','/a/x.woff2')==='字体');
ok('type-unknown', C.typeOf('','')==='未知');
ok('empty', C.analyze('').error!=null);
ok('badjson', C.analyze('{oops').error!=null);
ok('noentries', C.analyze('{"log":{"entries":[]}}').error!=null);
const H={log:{version:'1.2',creator:{name:'DevTools'},pages:[{id:'p1'}],entries:[
 {startedDateTime:'2026-08-02T10:00:00.000Z',time:300,request:{method:'GET',url:'https://cdn.x.com/a.js'},
  response:{status:200,headersSize:100,bodySize:900,content:{size:3000,mimeType:'application/javascript'}},
  timings:{blocked:5,dns:10,connect:20,ssl:10,send:1,wait:200,receive:54}},
 {startedDateTime:'2026-08-02T10:00:00.100Z',time:1200,request:{method:'GET',url:'https://img.x.com/b.png'},
  response:{status:200,headersSize:100,bodySize:5000,content:{size:5000,mimeType:'image/png'}},
  timings:{blocked:1,dns:0,connect:0,ssl:0,send:1,wait:100,receive:1098}},
 {startedDateTime:'2026-08-02T10:00:00.200Z',time:40,request:{method:'POST',url:'https://api.x.com/t'},
  response:{status:500,headersSize:80,bodySize:20,content:{size:20,mimeType:'application/json'}},
  timings:{blocked:0,dns:0,connect:0,ssl:0,send:1,wait:38,receive:1}}
]}};
const r=C.analyze(JSON.stringify(H));
ok('ok', !r.error);
const v=r.value;
ok('count', v.summary.count===3);
ok('domains', v.summary.domains===3);
ok('errors', v.summary.errors===1);
ok('creator', v.creator==='DevTools');
ok('pages', v.pages===1);
ok('transfer', v.summary.totalTransfer===(1000+5100+100));
ok('content', v.summary.totalContent===8020);
ok('saved', v.summary.saved===8020-6200);
ok('avg', Math.round(v.summary.avgTime)===Math.round((300+1200+40)/3));
ok('slowest', v.slowest[0].time===1200);
ok('largest', v.largest[0].transfer===5100);
ok('status500', v.statuses['500']===1);
ok('methods', v.methods.GET===2&&v.methods.POST===1);
ok('types-js', v.types.some(function(t){return t.type==='JS'&&t.count===1;}));
ok('timing-wait', v.timings.wait===338);
ok('errlist', v.errorList.length===1&&v.errorList[0].status===500);
ok('advice-err', v.advice.join('|').indexOf('失败请求')>=0);
ok('bare-log', C.analyze(JSON.stringify(H.log)).value.summary.count===3);
const H2={log:{entries:[{time:10,request:{url:'https://a.com/x'},response:{status:200,content:{size:10,mimeType:'text/html'}},timings:{}}]}};
ok('minimal', C.analyze(JSON.stringify(H2)).value.summary.count===1);
ok('advice-clean', C.analyze(JSON.stringify(H2)).value.advice.length>=1);
console.log((fail?'FAIL':'PASS')+' HarForge '+pass+'/'+fail);process.exit(fail?1:0);
