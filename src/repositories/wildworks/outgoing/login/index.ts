import { createHmac } from 'node:crypto';
import { create } from 'xmlbuilder2';
import { LoginMessageOptions } from './LoginMessageOptions';

export class LoginMessage {
  /**
   * Builds the login xml message.
   * @param login The login data.
   */
  public static build(options: LoginMessageOptions) {
    const loginXml = create()
      .ele('login')
      .att('z', 'sbiLogin')
      .ele('nick')
      .dat(
        options.isMobile
          ? `${options.screen_name}%0%${options.deploy_version}%9%0%A PC%0%-1%0`
          : `${options.screen_name}%%0%${options.deploy_version}%PlugIn%32.0,0,403%WIN%0`
      )
      .up()
      .ele('pword')
      .dat(options.auth_token)
      .up()

    let hash = ''

    if (!options.isMobile) {
      hash = createHmac('sha256', options.hash)
        .update(loginXml.toString({ headless: true }))
        .digest('base64')
    }

    const msgXml = create()
      .ele('msg')
      .att('t', 'sys')
      .ele('body')
      .att('action', 'login')
      .att('r', '0')
      .import(loginXml)
      .up()

    if (!options.isMobile) msgXml.att('h', hash);
    return msgXml.end({ headless: true })
  }
}