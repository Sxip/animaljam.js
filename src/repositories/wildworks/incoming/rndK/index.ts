import { WildworksRepository } from "../..";
import { IncomingMessageHandler } from "../../decorators/PacketHandler";
import { XMLMessage } from "../../messages/XMLMessage";
import { LoginMessage } from "../../outgoing/login";

export class RndKMessage {
  /**
   * Handles rndk packet.
   * @param param The packet to handle.
   * @returns {void}
   */
  @IncomingMessageHandler<XMLMessage>({
    message: "rndK",
  })
  public handle({ message }: XMLMessage, wildworks: WildworksRepository): void {
    const hash = message("msg").text();

    wildworks.sendRawMessage(
      LoginMessage.build({
        isMobile: wildworks.options.domain === "mobile",
        screen_name: wildworks.options.screen_name,
        auth_token: wildworks.options.auth_token,
        deploy_version: wildworks.options.deploy_version,
        hash: hash,
      }),
    );
  }
}
