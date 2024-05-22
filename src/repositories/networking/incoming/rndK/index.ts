import { NetworkingRepository } from '../../../networking'
import { IncomingMessageHandler } from '../../decorators/PacketHandler'
import { XMLMessage } from '../../messages/XMLMessage'
import { LoginMessage } from '../../outgoing/login'

export class RndKMessage {
  /**
   * Handles rndk packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler({
    message: 'rndK',
  })
  public handle ({ message }: XMLMessage, networking: NetworkingRepository): void {
    const hash = message('msg').text()

    networking.sendRawMessage(LoginMessage.build({
      screen_name: networking.options.screen_name,
      auth_token: networking.options.auth_token,
      deploy_version: networking.options.deploy_version,
      hash: hash
    }))
  }
}