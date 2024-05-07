import { CheerioAPI, load } from "cheerio";
import { Message } from "./Message";

export class XMLMessage extends Message<CheerioAPI> {
  public parse (): void {
    this.message = load(this.messageRaw, {
      xmlMode: true
    })

    this.type = this.message('body').attr('action')
  }
  
  public toMessage(): string {
    return this.message.xml()
  }
}