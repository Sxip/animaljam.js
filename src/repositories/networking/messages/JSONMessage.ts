import { Message } from './Message'


export class JSONMessage extends Message<any> {
  /**
   * Handles the parsing of the message.
   * @returns {void}
   */
  public parse (): void {
    this.message = JSON.parse(this.messageRaw)
    this.type = this.message.b.o._cmd
  }

  /**
   * Converts the message to a string.
   * @returns {string}
   */
  public toMessage (): string {
    return JSON.stringify(this.message)
  }
}