import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";

export class ItemUseMessage {
  /**
   * Handles item use/equip confirmation packet.
   * @param param The packet to handle.
   */
  @IncomingMessageHandler<XTMessage>({
    message: "iu",
  })
  public handle({ message }: XTMessage, wildworks: WildworksRepository): void {
    const success = parseInt(message[4]);

    if (success === 1) {
      // Todo: Handle successful item use/equip confirmation
    }
  }
}
