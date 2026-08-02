const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }

// ---- base64url ----
ok(P.base64UrlFromBytes([102,111,111])==='Zm9v', 'base64url encodes 3-byte group');
ok(P.base64UrlFromBytes([102])==='Zg', 'base64url drops padding for 1 leftover byte');
ok(P.base64UrlFromBytes([102,111])==='Zm8', 'base64url drops padding for 2 leftover bytes');
ok(P.base64UrlFromBytes([])==='', 'base64url of empty input is empty');
ok(P.base64UrlFromBytes([251,255])==='-_8', 'base64url uses - and _ instead of + and /');
ok(P.bytesFromBase64Url('Zm9v').join(',')==='102,111,111', 'base64url decodes back to bytes');
ok(P.bytesFromBase64Url('-_8').join(',')==='251,255', 'base64url decode handles url-safe alphabet');
ok(P.bytesFromBase64Url('!!!')===null, 'base64url decode rejects invalid characters');

// ---- RFC 7636 Appendix B test vector ----
const RFC_V='dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
const RFC_C='E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';
ok(P.sha256Base64Url(RFC_V)===RFC_C, 'RFC 7636 Appendix B S256 test vector matches');
ok(P.codeChallenge(RFC_V,'S256').value===RFC_C, 'codeChallenge S256 matches RFC vector');
ok(P.codeChallenge(RFC_V,'S256').method==='S256', 'S256 method echoed back');
ok(P.codeChallenge('abc','plain').value==='abc', 'plain method returns verifier unchanged');
ok(P.codeChallenge('abc','plain').method==='plain', 'plain method normalised to lowercase');
ok(P.codeChallenge('abc','MD5').error!==null, 'unsupported method reports an error');
ok(P.sha256Base64Url('').length===43, 'S256 challenge is always 43 chars');
ok(P.sha256Base64Url('a')!==P.sha256Base64Url('b'), 'different verifiers give different challenges');

// ---- verify challenge ----
ok(P.verifyChallenge(RFC_V,RFC_C,'S256').ok===true, 'verifyChallenge accepts the matching pair');
ok(P.verifyChallenge(RFC_V,RFC_C.replace(/.$/,'X'),'S256').ok===false, 'verifyChallenge rejects a tampered challenge');
ok(P.verifyChallenge(RFC_V,'short','S256').ok===false, 'verifyChallenge rejects length mismatch');

// ---- verifier generation ----
ok(P.verifierFromBytes(new Array(32).fill(0)).length===43, '32 random bytes produce a 43-char verifier');
const gen64=P.verifierFromEntropy([1,2,3,4,5],64);
ok(gen64.length===64, 'verifierFromEntropy honours requested length');
ok(/^[A-Za-z0-9\-._~]+$/.test(gen64), 'generated verifier only uses unreserved characters');
ok(P.verifierFromEntropy([1],10).length===43, 'verifier length floors at 43');
ok(P.verifierFromEntropy([1],999).length===128, 'verifier length caps at 128');
ok(P.entropyBits('x'.repeat(43))===260, '43 unreserved chars carry about 260 bits of entropy');
ok(P.entropyBits('')===0, 'empty verifier carries no entropy');

// ---- validation ----
ok(P.validateVerifier(RFC_V).ok===true, 'RFC sample verifier validates');
ok(P.validateVerifier(RFC_V).issues.length===0, 'RFC sample verifier raises no issues');
ok(P.validateVerifier('short').ok===false, 'verifier below 43 chars is rejected');
ok(P.validateVerifier('x'.repeat(129)).ok===false, 'verifier above 128 chars is rejected');
ok(P.validateVerifier('a'.repeat(42)+'+').ok===false, 'non-unreserved character is rejected');
ok(P.validateVerifier('').ok===false, 'empty verifier is rejected');

// ---- authorization URL ----
const url=P.buildAuthUrl({endpoint:'https://auth.example.com/authorize',clientId:'cid',redirectUri:'https://app/cb',scope:'openid profile',state:'st',challenge:RFC_C,method:'S256'});
ok(url.value.indexOf('response_type=code')>0, 'auth URL defaults response_type to code');
ok(url.value.indexOf('code_challenge='+RFC_C)>0, 'auth URL carries the challenge');
ok(url.value.indexOf('code_challenge_method=S256')>0, 'auth URL carries the method');
ok(url.value.indexOf('redirect_uri=https%3A%2F%2Fapp%2Fcb')>0, 'auth URL percent-encodes redirect_uri');
ok(url.value.indexOf('scope=openid%20profile')>0, 'auth URL encodes spaces in scope');
ok(url.value.indexOf('?')>0 && url.value.indexOf('&&')<0, 'auth URL query string is well formed');
ok(P.buildAuthUrl({endpoint:'https://a/x?tenant=1',clientId:'c',challenge:'z'}).value.indexOf('?tenant=1&')>0, 'existing query string is preserved with &');
ok(P.buildAuthUrl({}).error!==null, 'missing endpoint reports an error');

// ---- callback parsing ----
const cb=P.parseCallback('https://app/cb?code=AC1&state=st','st');
ok(cb.code==='AC1' && cb.state==='st', 'callback code and state are extracted');
ok(cb.ok===true && cb.stateMatch===true, 'matching state marks the callback valid');
const bad=P.parseCallback('https://app/cb?code=AC1&state=other','st');
ok(bad.ok===false && /state/.test(bad.reason), 'mismatched state is rejected as CSRF');
const err=P.parseCallback('https://app/cb?error=access_denied&error_description=user+said+no','st');
ok(err.ok===false && err.error==='access_denied', 'error callback surfaces the error code');
ok(err.errorDescription==='user said no', 'error_description is plus-decoded');
ok(P.parseCallback('https://app/cb#code=AC2','').code==='AC2', 'fragment style callback is parsed');
ok(P.parseCallback('https://app/cb?code=A&iss=https%3A%2F%2Fidp','').extra.iss==='https://idp', 'unknown params land in extra');
ok(P.parseCallback('https://app/cb','').ok===false, 'callback without code is invalid');

// ---- token request ----
const tr=P.buildTokenRequest({endpoint:'https://auth/token',code:'AC1',redirectUri:'https://app/cb',clientId:'cid',verifier:RFC_V});
ok(tr.body.indexOf('grant_type=authorization_code')===0, 'token body starts with grant_type');
ok(tr.body.indexOf('code_verifier='+RFC_V)>0, 'token body carries the verifier');
ok(tr.contentType==='application/x-www-form-urlencoded', 'token request uses form encoding');
ok(P.buildTokenRequest({code:'x'}).body.indexOf('redirect_uri')<0, 'empty fields are omitted from the body');
const cu=P.curlToken({endpoint:'https://auth/token',code:'AC1',verifier:RFC_V});
ok(cu.indexOf('https://auth/token')>0 && cu.indexOf('--data-raw')>0, 'curl command targets the token endpoint');

// ---- flow lint ----
const good=P.lintFlow({endpoint:'https://auth/authorize',clientId:'cid',redirectUri:'https://app/cb',scope:'openid profile',state:'9f2c41ab77de05e3',method:'S256',verifier:RFC_V,nonce:'n1'});
ok(good.issues.length===0, 'a best-practice flow raises no lint issues');
ok(good.score===100 && good.grade==='A', 'clean flow scores 100 / grade A');
ok(P.lintFlow({endpoint:'https://a',clientId:'c',redirectUri:'https://app/cb',state:'9f2c41ab77de05e3',method:'plain',verifier:RFC_V,scope:'read'}).issues.some(function(i){return /plain/.test(i.msg);}), 'plain method is flagged');
ok(P.lintFlow({endpoint:'http://a',clientId:'c',redirectUri:'https://app/cb',state:'9f2c41ab77de05e3',verifier:RFC_V,scope:'read'}).issues.some(function(i){return /https/.test(i.msg);}), 'non-https endpoint is flagged');
ok(P.lintFlow({endpoint:'https://a',clientId:'c',redirectUri:'http://evil.example/cb',state:'9f2c41ab77de05e3',verifier:RFC_V,scope:'read'}).issues.some(function(i){return /中间人/.test(i.msg);}), 'plaintext non-loopback redirect is flagged');
ok(P.lintFlow({endpoint:'https://a',clientId:'c',redirectUri:'http://localhost:5173/cb',state:'9f2c41ab77de05e3',verifier:RFC_V,scope:'read'}).issues.length===0, 'http loopback redirect is allowed');
ok(P.lintFlow({endpoint:'https://a',clientId:'c',redirectUri:'https://app/cb',verifier:RFC_V,scope:'read'}).issues.some(function(i){return /state/.test(i.msg);}), 'missing state is flagged');
ok(P.lintFlow({endpoint:'https://a',clientId:'c',redirectUri:'https://app/cb',state:'9f2c41ab77de05e3',verifier:RFC_V,scope:'read',clientSecret:'s3cr3t'}).issues.some(function(i){return /client_secret/.test(i.msg);}), 'embedded client_secret is flagged');
ok(P.lintFlow({endpoint:'https://a',clientId:'c',redirectUri:'https://app/cb',state:'9f2c41ab77de05e3',verifier:RFC_V,scope:'openid'}).issues.some(function(i){return /nonce/.test(i.msg);}), 'OIDC without nonce is flagged');
ok(P.lintFlow({endpoint:'https://a',clientId:'c',redirectUri:'https://app/cb',state:'9f2c41ab77de05e3',verifier:RFC_V,scope:'read',responseType:'code token'}).issues.some(function(i){return /隐式流/.test(i.msg);}), 'implicit flow response_type is flagged');
ok(P.lintFlow({}).score<60, 'an empty config scores poorly');
ok(P.gradeOf(95)==='A' && P.gradeOf(10)==='F', 'grade thresholds behave');

ok(P.splitUri('https://a.example.com:8443/x/y').host==='a.example.com', 'splitUri strips the port from host');
ok(P.splitUri('not a url')===null, 'splitUri rejects non-URLs');

console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
