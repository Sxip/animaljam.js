import { NetworkingRepository } from '.'
import { handlers } from './decorators/PacketHandler'
import { XMLMessage } from './messages/XMLMessage'

export class PacketHandler {
  public constructor (private readonly networking: NetworkingRepository) {}

  /**
   * Handles the received message string.
   * @param message The received message string.
   * @returns {void}
   */
  public validate (message: string): XMLMessage {
    const type = message.charAt(0)

    switch (type) {
      case '<':
        return new XMLMessage(message)

      case '{':
        break

      case '%':
        break
    }
  }

  public handle (validMessage: XMLMessage): void {
    const { type, message } = validMessage

    for (const handler of handlers) {
      if (handler.message === type) {
        handler.handler(validMessage, this.networking)
      }
    }
  }
}