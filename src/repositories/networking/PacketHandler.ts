import { NetworkingRepository } from '../networking'
import { handlers } from './decorators/PacketHandler'
import { JSONMessage } from './messages/JSONMessage'
import { XMLMessage } from './messages/XMLMessage'
import { XTMessage } from './messages/XTMessage'

export class PacketHandler {
  public constructor (private readonly networking: NetworkingRepository) {}

  /**
   * Handles the received message string.
   * @param message The received message string.
   * @returns {void}
   */
  public validate (message: string): XMLMessage | JSONMessage | XTMessage {
    const type = message.charAt(0)

    switch (type) {
      case '<':
        return new XMLMessage(message)

      case '{':
        return new JSONMessage(message)

      case '%':
        return new XTMessage(message)
    }
  }

  public handle (validMessage: XMLMessage | JSONMessage | XTMessage): void {
    const { type } = validMessage

    for (const handler of handlers) {
      if (handler.message === type) handler.handler(validMessage, this.networking)
    }
  }
}