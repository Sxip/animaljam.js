import { WildworksRepository } from ".";
import { handlers } from "./decorators/PacketHandler";
import { JSONMessage } from "./messages/JSONMessage";
import { XMLMessage } from "./messages/XMLMessage";
import { XTMessage } from "./messages/XTMessage";

export class PacketHandler {
  public constructor(private readonly wildworks: WildworksRepository) {}

  /**
   * Handles the received message string.
   * @param message The received message string.
   * @returns {XMLMessage | JSONMessage | XTMessage}
   */
  public validate(message: string): XMLMessage | JSONMessage | XTMessage {
    const type = message.charAt(0);

    switch (type) {
      case "<":
        return new XMLMessage(message);

      case "{":
        return new JSONMessage(message);

      case "%":
        return new XTMessage(message);

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  }

  public async handle(
    validMessage: XMLMessage | JSONMessage | XTMessage,
  ): Promise<void> {
    const { type } = validMessage;

    for (const handler of handlers) {
      if (handler.message === type) {
        await handler.handler(validMessage, this.wildworks);
      }
    }
  }
}
