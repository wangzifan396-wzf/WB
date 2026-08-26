
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('dns A ok', A.validateDns('A','1.2.3.4').valid===true);
  ok('dns A bad', A.validateDns('A','999.1.1.1').valid===false);
  ok('dns AAAA ok', A.validateDns('AAAA','2001:db8::1').valid===true);
  ok('dns CNAME ok', A.validateDns('CNAME','mail.example.com').valid===true);
  ok('dns MX ok', A.validateDns('MX','10 mail.example.com').valid===true);
  ok('dns MX bad', A.validateDns('MX','mail.example.com').valid===false);
  ok('dns NS ok', A.validateDns('NS','ns1.example.com').valid===true);
  ok('dns TXT ok', A.validateDns('TXT','"v=spf1 -all"').valid===true);
  ok('dns SRV ok', A.validateDns('SRV','10 5 5060 sip.example.com').valid===true);
  ok('dns SRV bad', A.validateDns('SRV','x y z w').valid===false);
  ok('dns SOA ok', A.validateDns('SOA','ns1 host 1 2 3 4 5').valid===true);
  ok('dns unknown', A.validateDns('XYZ','a').valid===false);
  console.log(T.join('\n'));
  console.log('DNS_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
