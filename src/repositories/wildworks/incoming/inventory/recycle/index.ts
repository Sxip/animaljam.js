import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";

export class ItemRecycleMessage {
  /**
   * Handles item recycle confirmation packet.
   * @param param The packet to handle.
   */
  @IncomingMessageHandler<XTMessage>({
    message: "ir",
  })
  public handle({ message }: XTMessage, wildworks: WildworksRepository): void {
    const status = parseInt(message[4]);

    if (status !== 1) {
      return;
    }

    const gemsEarned = parseInt(message[5]);
    const itemId = parseInt(message[6]);

    wildworks.context.me.removeItem(itemId, 1);

    const currentGems = wildworks.context.me.getCurrencies().gems || 0;
    wildworks.context.me.updateCurrencies({ gems: currentGems + gemsEarned });
  }
}
