import { NetworkingRepository } from '../..'
import { IncomingMessageHandler } from '../../decorators/PacketHandler'

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
    if (networking.options.domain === 'mobile') {
      return networking.sendRawMessage(`%xt%o%rj%-1%Jamaa.World#-1%0%`)
    } else {
      return networking.sendRawMessage(`xt%o%rj%-1%jamaa_township.room_main#-1%1%0%0`)
    }
  }
}