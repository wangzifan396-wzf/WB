const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

// ---- escaping ----
ok(P.escapeXml('a & b')==='a &amp; b', 'ampersand is escaped');
ok(P.escapeXml('<x>')==='&lt;x&gt;', 'angle brackets are escaped');
ok(P.escapeXml('say "hi"')==='say &quot;hi&quot;', 'double quotes are escaped');
ok(P.escapeXml(null)==='', 'null escapes to empty string');

// ---- date handling ----
const d=P.parseDate('2026-07-31');
ok(d!==null && d.getUTCFullYear()===2026, 'bare date parses as UTC midnight');
ok(P.rfc822(d)==='Fri, 31 Jul 2026 00:00:00 GMT', 'rfc822 renders the RSS pubDate format');
ok(P.rfc3339(d)==='2026-07-31T00:00:00Z', 'rfc3339 renders the Atom updated format');
ok(P.rfc822(P.parseDate('2026-01-01'))==='Thu, 01 Jan 2026 00:00:00 GMT', 'weekday and zero padding are correct');
ok(P.rfc3339(P.parseDate('2026-07-31 09:05'))==='2026-07-31T09:05:00Z', 'date with time keeps hours and minutes');
ok(P.rfc3339(P.parseDate('2026-07-31T09:00+08:00'))==='2026-07-31T01:00:00Z', 'positive offset converts back to UTC');
ok(P.rfc3339(P.parseDate('2026-07-31T00:00-05:00'))==='2026-07-31T05:00:00Z', 'negative offset converts back to UTC');
ok(P.parseDate('')===null, 'empty date returns null');
ok(P.parseDate('not a date')===null, 'garbage date returns null');
ok(P.rfc822(null)==='', 'rfc822 of null is empty');

// ---- item parsing ----
const SRC='# 第一篇\nurl: https://e.com/1\ndate: 2026-07-31\nauthor: 甲\ntags: a, b\n这是第一篇的摘要正文，长度足够通过体检。\n第二行仍然属于同一条摘要。\n\n# 第二篇\nlink: https://e.com/2\ndate: 2026-07-30\n这是第二篇的摘要，同样写得足够长以避免触发提示。';
const items=P.parseItems(SRC);
ok(items.length===2, 'two blocks parse into two items');
ok(items[0].title==='第一篇', 'heading becomes the item title');
ok(items[0].url==='https://e.com/1', 'url key is captured');
ok(items[1].url==='https://e.com/2', 'link is accepted as an alias for url');
ok(items[0].author==='甲', 'author key is captured');
ok(items[0].tags.length===2 && items[0].tags[1]==='b', 'tags split on commas and trim');
ok(items[0].description==='这是第一篇的摘要正文，长度足够通过体检。\n第二行仍然属于同一条摘要。', 'remaining lines become the description');
ok(items[0].guid==='https://e.com/1', 'guid defaults to the url');
ok(P.parseItems('').length===0, 'empty input yields no items');
ok(P.parseItems('没有井号开头的行').length===0, 'text before the first heading is ignored');
ok(P.parseItems('# 只有标题')[0].description==='', 'a title-only item has an empty description');
ok(P.parseItems('# t\ntags: 中文，逗号')[0].tags.length===2, 'full-width comma also splits tags');

const FEED={title:'源',link:'https://e.com/',self:'https://e.com/feed.xml',description:'简介文字够长了吧',language:'zh-CN'};

// ---- RSS 2.0 ----
const rss=P.buildRss(FEED, items);
ok(rss.indexOf('<?xml version="1.0" encoding="UTF-8"?>')===0, 'RSS starts with the XML declaration');
ok(rss.indexOf('<rss version="2.0"')>0, 'RSS declares version 2.0');
ok(rss.indexOf('xmlns:atom=')>0, 'RSS declares the atom namespace for the self link');
ok((rss.match(/<item>/g)||[]).length===2, 'RSS emits one item element per entry');
ok(rss.indexOf('<pubDate>Fri, 31 Jul 2026 00:00:00 GMT</pubDate>')>0, 'RSS item carries an RFC 822 pubDate');
ok(rss.indexOf('<lastBuildDate>Fri, 31 Jul 2026 00:00:00 GMT</lastBuildDate>')>0, 'lastBuildDate uses the newest item date');
ok(rss.indexOf('isPermaLink="true"')>0, 'guid is marked as a permalink when it equals the url');
ok(rss.indexOf('<dc:creator>甲</dc:creator>')>0, 'author is emitted as dc:creator');
ok((rss.match(/<category>/g)||[]).length===2, 'each tag becomes a category element');
ok(P.buildRss({title:'a & b'},[]).indexOf('<title>a &amp; b</title>')>0, 'channel title is XML escaped');
ok(P.buildRss({},[]).indexOf('未命名订阅源')>0, 'missing feed title falls back to a placeholder');

// ---- Atom 1.0 ----
const atom=P.buildAtom(FEED, items);
ok(atom.indexOf('<feed xmlns="http://www.w3.org/2005/Atom"')>0, 'Atom declares the correct namespace');
ok((atom.match(/<entry>/g)||[]).length===2, 'Atom emits one entry per item');
ok(atom.indexOf('<updated>2026-07-31T00:00:00Z</updated>')>0, 'Atom uses RFC 3339 timestamps');
ok(atom.indexOf('<link rel="self" href="https://e.com/feed.xml"/>')>0, 'Atom carries the self link');
ok(atom.indexOf('<author><name>甲</name></author>')>0, 'Atom nests the author name');
ok(atom.indexOf('<category term="a"/>')>0, 'Atom categories use the term attribute');

// ---- JSON Feed ----
const jf=JSON.parse(P.buildJsonFeed(FEED, items));
ok(jf.version==='https://jsonfeed.org/version/1.1', 'JSON Feed declares version 1.1');
ok(jf.items.length===2, 'JSON Feed carries both items');
ok(jf.items[0].date_published==='2026-07-31T00:00:00Z', 'JSON Feed dates are RFC 3339');
ok(jf.items[0].authors[0].name==='甲', 'JSON Feed authors are an array of objects');
ok(jf.feed_url==='https://e.com/feed.xml', 'JSON Feed carries feed_url');
ok(jf.items[1].tags===undefined, 'items without tags omit the tags key');

// ---- lint ----
const clean=P.lintFeed(FEED, items);
ok(clean.issues.length===0, 'a well-formed feed passes lint');
ok(clean.score===100 && clean.grade==='A', 'clean feed scores 100 / grade A');
ok(P.lintFeed({},[]).issues.some(function(i){return /标题/.test(i.msg);}), 'missing feed title is flagged');
ok(P.lintFeed({title:'t'},[]).issues.some(function(i){return /没有任何条目/.test(i.msg);}), 'empty feed is flagged');
const dup=[{title:'a',guid:'g1',url:'u',date:'2026-07-31',description:'足够长的一段摘要文字在这里'},{title:'b',guid:'g1',url:'u2',date:'2026-07-30',description:'足够长的一段摘要文字在这里'}];
ok(P.lintFeed(FEED,dup).issues.some(function(i){return /guid/.test(i.msg);}), 'duplicate guid is flagged');
const asc=[{title:'a',guid:'1',url:'u1',date:'2026-07-01',description:'足够长的一段摘要文字在这里'},{title:'b',guid:'2',url:'u2',date:'2026-07-31',description:'足够长的一段摘要文字在这里'}];
ok(P.lintFeed(FEED,asc).issues.some(function(i){return /倒序/.test(i.msg);}), 'ascending order is flagged');
ok(!P.lintFeed(FEED,[{title:'a',guid:'1',url:'u',date:'2030-01-01',description:'一段够长的摘要文字放在这里避免触发提示'}]).issues.some(function(i){return /未来/.test(i.msg);}), 'future dates are not flagged when now is unknown');
ok(P.lintFeed({title:'t',link:'l',description:'d',self:'s',now:'2026-07-31'},[{title:'a',guid:'1',url:'u',date:'2030-01-01',description:'一段够长的摘要文字放在这里避免触发提示'}]).issues.some(function(i){return /未来/.test(i.msg);}), 'future date is flagged when now is known');
ok(P.lintFeed(FEED,[{title:'a',guid:'1',url:'u',date:'2026-07-31',description:'太短'}]).issues.some(function(i){return /摘要短于/.test(i.msg);}), 'very short summaries are flagged');
ok(P.lintFeed(FEED,[{title:'',guid:'1',url:'u',date:'2026-07-31',description:'足够长的一段摘要文字在这里'}]).issues.some(function(i){return /缺少标题/.test(i.msg);}), 'item without a title is flagged');
ok(P.gradeOf(80)==='B' && P.gradeOf(0)==='F', 'grade thresholds behave');

// ---- stats ----
const st=P.feedStats(items);
ok(st.count===2, 'stats count all items');
ok(st.withLink===2, 'stats count items that carry a link');
ok(st.spanDays===1, 'stats measure the span in days');
ok(st.first==='2026-07-30T00:00:00Z' && st.last==='2026-07-31T00:00:00Z', 'stats report the oldest and newest dates');
ok(st.topTags.length===2, 'stats rank the tags');
ok(P.feedStats([]).count===0 && P.feedStats([]).avgChars===0, 'empty stats do not divide by zero');
ok(P.latestDate([],'2026-07-31')!==null, 'latestDate falls back to the provided now');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
