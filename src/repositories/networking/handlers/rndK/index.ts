import { NetworkingRepository } from "../..";
import { MessageHandle } from "../../decorators/PacketHandler";
import { XMLMessage } from "../../messages/XMLMessage";

export class RndKMessage {
  /**
   * Handles rndk packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @MessageHandle({ 
    message: 'rndK',
  })
  public async handle (message: XMLMessage, networking: NetworkingRepository): Promise<void> {
    // Handle rndk message
  }
}