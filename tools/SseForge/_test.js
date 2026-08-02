
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }

// ---- parseField ----
eq(P.parseField('').kind,'blank','blank line');
eq(P.parseField(': hi').kind,'comment','comment line');
eq(P.parseField(': hi').value,' hi','comment keeps its own spacing');
var f=P.parseField('data: x');
eq(f.name,'data','field name');
eq(f.value,'x','one leading space stripped');
eq(P.parseField('data:  x').value,' x','only ONE leading space stripped');
eq(P.parseField('data:x').value,'x','no space is fine');
eq(P.parseField('data').name,'data','bare field name');
eq(P.parseField('data').value,'','bare field empty value');
eq(P.parseField('a:b:c').value,'b:c','only first colon splits');

// ---- splitLines: CRLF / CR / LF ----
var s1=P.splitLines('a\r\nb\rc\nd');
eq(s1.lines.length,4,'all three terminators split');
eq(s1.lines[0],'a','crlf line');
eq(s1.lines[1],'b','cr line');
eq(s1.lines[2],'c','lf line');
eq(s1.complete[3],false,'trailing partial marked incomplete');
eq(P.splitLines('\uFEFFdata: x').lines[0],'data: x','BOM stripped');
eq(P.splitLines('a\n').lines.length,1,'trailing newline yields no phantom line');
eq(P.splitLines('a\n').complete[0],true,'terminated line is complete');

// ---- parseStream basics ----
var r=P.parseStream('data: hello\n\n');
eq(r.events.length,1,'one event');
eq(r.events[0].data,'hello','data value');
eq(r.events[0].event,'message','default event type');
eq(r.events[0].id,'','no id');

var r2=P.parseStream('event: tick\nid: 7\nretry: 2500\ndata: a\ndata: b\n\n');
eq(r2.events.length,1,'multiline event');
eq(r2.events[0].event,'tick','custom event type');
eq(r2.events[0].data,'a\nb','data lines joined with LF');
eq(r2.events[0].id,'7','id captured');
eq(r2.events[0].retry,2500,'retry captured');
eq(r2.retry,2500,'stream retry state');
eq(r2.lastId,'7','lastId state');

// event type resets after dispatch
var r3=P.parseStream('event: a\ndata: 1\n\ndata: 2\n\n');
eq(r3.events.length,2,'two events');
eq(r3.events[0].event,'a','first typed');
eq(r3.events[1].event,'message','event type resets after dispatch');

// id persists across events (Last-Event-ID semantics)
var r4=P.parseStream('id: 9\ndata: 1\n\ndata: 2\n\n');
eq(r4.events[1].id,'9','last id persists to later events');

// empty data buffer must NOT dispatch
var r5=P.parseStream('event: nodata\n\ndata: real\n\n');
eq(r5.events.length,1,'event without data is not dispatched');
eq(r5.events[0].data,'real','only the real one survives');

// comment lines
var r6=P.parseStream(': keepalive\n\ndata: x\n\n');
eq(r6.comments.length,1,'comment captured');
eq(r6.events.length,1,'comment does not dispatch an event on its own');

// unknown fields ignored
eq(P.parseStream('foo: bar\ndata: x\n\n').events[0].data,'x','unknown field ignored');

// invalid retry ignored
eq(P.parseStream('retry: 3s\ndata: x\n\n').events[0].retry,null,'non-numeric retry ignored');
eq(P.parseStream('retry: 1000\ndata: x\n\n').events[0].retry,1000,'numeric retry accepted');

// id with NUL ignored
eq(P.parseStream('id: a\u0000b\ndata: x\n\n').events[0].id,'','id containing NUL ignored');

// trailing newline removed from data buffer
eq(P.parseStream('data: a\ndata: \n\n').events[0].data,'a\n','empty trailing data line keeps one LF');

// incomplete stream
var r7=P.parseStream('data: pending');
eq(r7.events.length,0,'no dispatch without blank line');
ok(r7.incomplete,'incomplete flagged');
eq(r7.pendingLine,'data: pending','pending partial line surfaced');

var r8=P.parseStream('data: buffered\n');
eq(r8.events.length,0,'buffered but undispatched');
ok(r8.incomplete,'buffered data flagged incomplete');
eq(r8.pendingData,'buffered\n','pending data buffer surfaced');

// ---- incremental parser: byte-by-byte equivalence ----
var STREAM='id: 1\nevent: tick\ndata: {"a":1}\n\n: ka\n\nid: 2\ndata: x\ndata: y\n\n';
(function(){
  for(var size=1; size<=9; size++){
    var p=P.createParser(), got=[];
    for(var i=0;i<STREAM.length;i+=size){
      p.feed(STREAM.slice(i,i+size)).events.forEach(function(e){ got.push(e); });
    }
    var whole=P.parseStream(STREAM).events;
    var same = got.length===whole.length && got.every(function(e,i){
      return e.event===whole[i].event && e.data===whole[i].data && e.id===whole[i].id;
    });
    ok(same, 'chunked feed size '+size+' matches whole-stream parse');
  }
})();

// CRLF chunked across the \r\n boundary
(function(){
  var p=P.createParser(), got=[];
  ['data: a\r','\n\r','\n'].forEach(function(c){ p.feed(c).events.forEach(function(e){ got.push(e); }); });
  eq(got.length,1,'CRLF split across chunks still dispatches once');
  eq(got[0].data,'a','CRLF split data intact');
})();

// parser.end() flushes a trailing unterminated line
(function(){
  var p=P.createParser();
  p.feed('data: tail');
  var e=p.end();
  eq(e.events.length,0,'end() alone does not dispatch without blank line');
  var p2=P.createParser();
  p2.feed('data: x\n');
  p2.feed('\n');
  eq(p2.state().buffered,'','buffer cleared after dispatch');
})();

// ---- serialize round trip ----
var text=P.serialize([{event:'tick', data:'{"a":1}', id:'1', retry:5000},{data:'plain'}]);
var back=P.parseStream(text);
eq(back.events.length,2,'round trip event count');
eq(back.events[0].event,'tick','round trip event name');
eq(back.events[0].data,'{"a":1}','round trip data');
eq(back.events[0].id,'1','round trip id');
eq(back.events[1].event,'message','round trip default type');
eq(P.serialize([{data:'a\nb'}]).indexOf('data: a\ndata: b')>=0,true,'multiline data split into data: lines');
ok(P.serialize([{comment:' ka'}]).indexOf(': ka')===0,'comment serialized');
ok(P.serialize([{data:'x'}],{crlf:true}).indexOf('\r\n')>=0,'crlf option');
eq(P.serialize([]),'','empty serialize');

// ---- stats ----
var st=P.stats(P.parseStream('event: a\ndata: 12345\n\nid: 3\ndata: xy\n\n: c\n\n'));
eq(st.events,2,'stats events');
eq(st.comments,1,'stats comments');
eq(st.dataBytes,7,'stats data bytes');
eq(st.withId,1,'stats with id');
eq(st.typeCount,2,'stats distinct types');
eq(st.maxDataLen,5,'stats max data len');

// ---- lint ----
function msgs(t){ return P.lint(t).map(function(i){ return i.level+':'+i.msg; }).join('\n'); }
ok(msgs('').indexOf('输入为空')>=0,'empty input hint');
ok(msgs('data: x\n\n').indexOf('没有注释行')>=0,'missing keepalive hinted');
ok(msgs('retry: 3s\ndata: x\n\n').indexOf('不是纯数字')>=0,'bad retry warned');
ok(msgs('data: x').indexOf('不完整的行')>=0,'truncated line warned');
ok(msgs('data: x\n').indexOf('未派发')>=0,'undispatched buffer warned');
ok(msgs('custom: 1\ndata: x\n\n').indexOf('未知字段')>=0,'unknown field warned');
ok(msgs('event: only\n\ndata: y\n\n').indexOf('凭空消失')>=0,'event without data warned');
ok(msgs('data: a\r\n\r\ndata: b\n\n').indexOf('CRLF')>=0,'mixed terminators warned');
ok(msgs('id: a\u0000b\ndata: x\n\n').indexOf('U+0000')>=0,'NUL id warned');
ok(msgs('\uFEFFdata: x\n\n').indexOf('BOM')>=0,'BOM noted');
ok(msgs('nothing here').indexOf('没有解析出任何事件')>=0,'no events warned');

// ---- curl + snippets ----
var c=P.toCurl('https://a.b/events', {'Last-Event-ID':'7'});
ok(c.indexOf('curl -N')===0,'curl starts with -N');
ok(c.indexOf('Accept: text/event-stream')>=0,'curl sets Accept');
ok(c.indexOf('Last-Event-ID: 7')>=0,'curl custom header');
ok(P.toCurl('', {}).indexOf('https://example.com/events')>=0,'curl default url');
ok(P.serverSnippet('nginx').indexOf('proxy_buffering off')>=0,'nginx snippet disables buffering');
ok(P.serverSnippet('node').indexOf('text/event-stream')>=0,'node snippet sets content type');
ok(P.serverSnippet('other').indexOf('Content-Length')>=0,'generic snippet mentions Content-Length');

console.log((fail? 'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
process.exit(fail?1:0);
