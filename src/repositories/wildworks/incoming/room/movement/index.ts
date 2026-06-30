import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";

export class PlayerMoveMessage {
  /**
   * Handles player movement packet (uc).
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<XTMessage>({
    message: "uc",
  })
  public handle({ message }: XTMessage, wildworks: WildworksRepository): void {
    const playerId = message[4];
    const x = parseInt(message[5]);
    const y = parseInt(message[6]);
    const frame = parseInt(message[7]);

    wildworks.context.map.playerMoved(playerId, x, y, frame);

    // Note: Server doesn't echo back your own movement
    // Local position is updated optimistically in walkTo()
  }
}
