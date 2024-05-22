import { NetworkingRepository } from '../..'
import { IncomingMessageHandler } from '../../decorators/PacketHandler'
import { JSONMessage } from '../../messages/JSONMessage'
import { WorldMessage } from '../../outgoing/world'

export class LoginMessage {
  /**
   * Handles rndk packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler({
    message: 'login',
  })
  public async handle (_: any, networking: NetworkingRepository): Promise<void> {
    return networking.sendRawMessage(WorldMessage.build())
  }
}