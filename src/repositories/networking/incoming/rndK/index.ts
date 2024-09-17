import { NetworkingRepository } from '../..'
import { IncomingMessageHandler } from '../../decorators/PacketHandler'
import { XMLMessage } from '../../messages/XMLMessage'
import { LoginMessage } from '../../outgoing/login'

export class RndKMessage {
  /**
   * Handles rndk packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<XMLMessage>({
    message: 'rndK',
  })
  public handle ({ message }: XMLMessage, networking: NetworkingRepository): void {
    const hash = message('msg').text()

    networking.sendRawMessage(LoginMessage.build({
      isMobile: networking.options.domain === 'mobile',
      screen_name: networking.options.screen_name,
      auth_token: networking.options.auth_token,
      deploy_version: networking.options.deploy_version,
      hash: hash
    }))
  }
}