import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";

export class AddPlayerMessage {
  /**
   * Handles add player packet (al).
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<XTMessage>({
    message: "al",
  })
  public handle({ message }: XTMessage, wildworks: WildworksRepository): void {
    const username = message[4];
    const playerId = message[5];

    wildworks.context.map.playerJoined(playerId, username, 0, 0, 0);

    const myUsername = wildworks.context.me.getUsername();
    if (username === myUsername) {
      wildworks.context.me.id = playerId;
    }
  }
}
