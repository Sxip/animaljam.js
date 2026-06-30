import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";

export class RemovePlayerMessage {
  /**
   * Handles remove player packet (rp or similar).
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<XTMessage>({
    message: "rp",
  })
  public handle({ message }: XTMessage, wildworks: WildworksRepository): void {
    const playerId = message[4];

    wildworks.context.map.playerLeft(playerId);
  }
}
