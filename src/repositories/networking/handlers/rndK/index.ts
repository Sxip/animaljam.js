import { createHmac } from 'node:crypto';
import xmlbuilder from 'xmlbuilder';
import { NetworkingRepository } from '../../';
import { MessageHandle } from '../../decorators/PacketHandler';
import { XMLMessage } from '../../messages/XMLMessage';

export class RndKMessage {

  /**
   * Handles rndk packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @MessageHandle({
    message: 'rndK',
  })
  public handle ({ message }: XMLMessage, networking: NetworkingRepository): void {
    const hash = message('msg').text()

    networking.sendRawMessage(this.response({
      screen_name: networking.options.screenName,
      auth_token: networking.options.authToken,
      deployVersion: networking.options.deployVersion,
      hash: hash
    }))
  }

  /**
   * Builds the login xml.
   * @param login The login data.
   * @returns {string}
   */
  public response (login: { screen_name: string, auth_token: string, deployVersion: string, hash: string }): string {
    const loginXml = xmlbuilder.create('login', { headless: true })
      .att('z', 'sbiLogin')
      .ele('nick').cdata(`${login.screen_name}%%0%${login.deployVersion}%PlugIn%32.0,0,403%WIN%0`).up()
      .ele('pword').cdata(login.auth_token).up()
      .end({ pretty: false });

    const loginTag = loginXml.toString();

    const hash = createHmac("sha256", login.hash)
      .update(loginTag)
      .digest("base64");

    const msgXml = xmlbuilder.create('msg', { headless: true })
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