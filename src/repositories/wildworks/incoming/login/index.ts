import { WildworksRepository } from "../..";
import { IncomingMessageHandler } from "../../decorators/PacketHandler";
import { JSONMessage } from "../../messages/JSONMessage";

export class LoginMessage {
  /**
   * Handles login packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<JSONMessage>({
    message: "login",
  })
  public async handle(
    { message }: JSONMessage,
    wildworks: WildworksRepository,
  ): Promise<void> {
    const { statusId, params } = message.b.o;

    if (statusId !== 1) return;

    wildworks.context.me.setPlayerData({
      username: params.userName,
      session: params.perUserAvId?.toString() || params.sessionId,
      uuid: params.uuid,
      gems: params.gemsCount,
      diamonds: params.diamondsCount,
      tickets: params.ticketsCount,
    });

    wildworks.context.connection.setConnected(true);

    if (wildworks.options.domain === "mobile") {
      await wildworks.sendRawMessage(`%xt%o%rj%-1%Jamaa.World#-1%0%`);
    } else {
      await wildworks.sendRawMessage(
        `%xt%o%rj%-1%jamaa_township.room_main#-1%1%0%0%`,
      );
    }

    console.log("Login successful!");
  }
}
