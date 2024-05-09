import { createHmac } from 'node:crypto';
import { create } from 'xmlbuilder';
import { LoginMessageOptions } from './LoginMessageOptions';

export class LoginMessage {
  /**
   * Builds the login xml message.
   * @param login The login data.
   */
  public static build (options: LoginMessageOptions) {
    const loginXml = create('login', { headless: true })
      .att('z', 'sbiLogin')
      .ele('nick').cdata(`${options.screen_name}%%0%${options.deploy_version}%PlugIn%32.0,0,403%WIN%0`).up()
      .ele('pword').cdata(options.auth_token).up()
      .end({ pretty: false });

    const loginTag = loginXml.toString();

    const hash = createHmac("sha256", options.hash)
      .update(loginTag)
      .digest("base64");

    const msgXml = create('msg', { headless: true })
      .att('t', 'sys')
      .att('h', hash)
      .ele('body')
      .att('action', 'login')
      .att('r', '0')
      .raw(loginTag)
      .up()
      .end({ pretty: false });

    return msgXml.toString()
  }
}