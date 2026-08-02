
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return SamlForgePure();')();
const assert=require('assert');
const xml='<saml2p:Response xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"><Issuer>https://idp.example.com</Issuer><saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:Subject><saml2:NameID>user@example.com</saml2:NameID></saml2:Subject><saml2:Conditions NotBefore="2020-01-01T00:00:00Z" NotOnOrAfter="2030-01-01T00:00:00Z"><saml2:Audience>https://sp.example.com</saml2:Audience></saml2:Conditions><saml2:AttributeStatement><saml2:Attribute Name="email"><saml2:AttributeValue>user@example.com</saml2:AttributeValue></saml2:Attribute><saml2:Attribute Name="role"><saml2:AttributeValue>admin</saml2:AttributeValue><saml2:AttributeValue>user</saml2:AttributeValue></saml2:Attribute></saml2:AttributeStatement></saml2:Assertion></saml2p:Response>';
const b64=Buffer.from(xml).toString('base64');
const r=P.analyze(b64);
assert.ok(!r.error, 'no error on base64');
assert.strictEqual(r.info.issuer,'https://idp.example.com');
assert.strictEqual(r.info.nameId,'user@example.com');
assert.strictEqual(r.info.audience[0],'https://sp.example.com');
assert.strictEqual(r.info.attributes.length,2);
assert.strictEqual(r.info.attributes[0].values[0],'user@example.com');
assert.strictEqual(r.info.attributes[1].values[1],'user');
assert.strictEqual(r.info.valid,true);
assert.ok(!P.analyze(xml).error, 'xml direct ok');
assert.ok(P.analyze('not xml or base64 !!!').error, 'bad input rejected');
console.log('PASS saml 8/0');
