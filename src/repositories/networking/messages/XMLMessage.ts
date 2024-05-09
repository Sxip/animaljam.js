import { CheerioAPI, load } from "cheerio";
import { Message } from "./Message";

export class XMLMessage extends Message<CheerioAPI> {
  /**
   * Handles the parsing of the message.
   * @returns {void}
   */
  public parse (): void {
    this.message = load(this.messageRaw, {
      xmlMode: true
    })

    this.type = this.message('body').attr('action')
  }

  /**
   * Converts the message to a string.
   * @returns {string}
   */
  public toMessage(): string {
    return this.message.xml()
  }
}