import { Message } from "./Message"

export class XTMessage extends Message<string[]> {
  /**
   * Handles the parsing of the message.
   * @returns {void}
   */
  public parse (): void {
    this.message = this.messageRaw.split('%')
    this.type = this.message[2]
  }

  /**
   * Converts the message to a string.
   * @returns {string}
   */
  public toMessage (): string {
    return this.message.join('%')
  }
}