import { CheerioAPI, load } from 'cheerio'
import { NetworkingRepository } from '..'

/**
 * Packets to import.
 */
export * from './rndK'

export class PacketHandler {
  public constructor (private readonly networking: NetworkingRepository) {}

  /**
   * Handles the received message string.
   * @param message The received message string.
   * @returns {void}
   */
  public async handleMessageReceived (message: string): Promise<void> {
    const type = message.charAt(0)

    switch (type) {
      case '<':
        if (message.includes('cross-domain')) await this.networking.sendRawMessage(`<msg t='sys'><body action='rndK' r='-1'></body></msg>`)
        this.handleXmlParse(message)
        break

      case '{':
        break

      case '%':
        break
    }
  }


  /**
   * Tries to parse the message as xml.
   * @param message The message to parse.
   * @returns {void}
   */
  private handleXmlParse (message: string): { type: string, value: CheerioAPI } {
    const value = load(message, {
      xmlMode: true
    })

    const type = value('body')
      .attr('action')

    return { type, value }
  }
}