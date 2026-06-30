import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";

export class RoomJoinMessage {
  /**
   * Handles room join packet (rj).
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<XTMessage>({
    message: "rj",
  })
  public async handle(
    { message }: XTMessage,
    wildworks: WildworksRepository,
  ): Promise<void> {
    const roomId = message[3];
    const success = message[4];
    const roomFullName = message[5];

    if (success === "1") {
      const roomNameOnly = roomFullName.split("#")[0];

      wildworks.context.map.setRoom(roomNameOnly);
      wildworks.context.connection.setRoomId(roomId);

      const username = wildworks.context.me.getUsername();
      const session = wildworks.context.me.getSession();
      if (username && session) {
        await wildworks.sendXTMessage(["pl", username]);
        await wildworks.sendXTMessage(["al", username]);
        await wildworks.sendXTMessage(["ad", username, session, "1"]);
      }
    }
  }
}
