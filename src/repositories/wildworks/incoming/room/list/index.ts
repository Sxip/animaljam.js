import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";

export class PlayerListMessage {
  /**
   * Handles player list packet (pl).
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<XTMessage>({
    message: "pl",
  })
  public handle({ message }: XTMessage, wildworks: WildworksRepository): void {
    const count = parseInt(message[4]);
    const username = wildworks.context.me.getUsername();

    for (let i = 0; i < count; i++) {
      const baseIndex = 5 + i * 11;
      const playerUsername = message[baseIndex];
      const playerId = message[baseIndex + 1];

      if (playerUsername === username) {
        wildworks.context.me.setPlayerData({
          username: username,
          playerId: playerId,
          session: wildworks.context.me.getSession(),
          uuid: wildworks.context.me.getUuid(),
          gems: wildworks.context.me.getCurrencies().gems,
          diamonds: wildworks.context.me.getCurrencies().diamonds,
          tickets: wildworks.context.me.getCurrencies().tickets,
        });
        wildworks.emit("ready");
        break;
      }
    }
  }
}
