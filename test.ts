import * as xmlbuilder from 'xmlbuilder';

export class LoginXMLBuilder {
  static build(login: { screen_name: string, auth_token: string }, buildVersion: string): string {
    const loginTag = xmlbuilder.create('login')
    .att('z', 'sbiLogin')
    .ele('nick').txt(`${login.screen_name}%0%${buildVersion}%9%0%Fake Computer Inc.%0%-1%0`).up()
    .ele('pword').txt(login.auth_token);

  const bodyTag = xmlbuilder.create('body')
    .att('action', 'login')
    .att('r', '0')
    .importDocument(loginTag);

  const msgTag = xmlbuilder.create('msg')
    .att('t', 'sys')
    .importDocument(bodyTag);

  // Get the XML string without XML declaration
  return msgTag.toString({ pretty: false, allowEmpty: true });
  }
}


console.log(LoginXMLBuilder.build({
  screen_name: 'niggeur',
  auth_token: 'asdfasdf',
}, '1000'))