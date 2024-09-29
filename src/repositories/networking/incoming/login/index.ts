import { NetworkingRepository } from '../..'
import { IncomingMessageHandler } from '../../decorators/PacketHandler'
import { JSONMessage } from '../../messages/JSONMessage'
import { User } from '../../objects/user'

export class LoginMessage {
  /**
   * Handles login packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<JSONMessage>({
    message: 'login',
  })
  public async handle ({ message }: JSONMessage, networking: NetworkingRepository): Promise<void> {
    const { statusId, params } = message.b.o

    /**
     * If the status id is not 1, it means the login failed.
     */
    if (statusId !== 1) return

    /**
     * Creates the user object.
     */
    networking.user = new User({ 
      username: params.userName,
      session: params.sessionId,
      uuid: params.uuid,
    })
    
    if (networking.options.domain === 'mobile') {
      await networking.sendRawMessage(`%xt%o%rj%-1%Jamaa.World#-1%0%`)
    } else {
      await networking.sendRawMessage(`%xt%o%rj%-1%jamaa_township.room_main#-1%1%0%0%`)
    }
  }
}