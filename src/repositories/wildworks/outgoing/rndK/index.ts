import { create } from 'xmlbuilder2'

export class RndKMessage {

  /**
   * Builds the rndk xml message.
   * @returns {string}
   */
  public static build (): string {
    const rndkXml = create()
    .ele('msg')
    .att('t', 'sys')
    .ele('body')
    .att('action', 'rndK')
    .att('r', '-1')
    .txt('')
    .up()
    .up()
    .end({ headless: true })


    /**
     * Animal Jam doesn't like the double quotes in the xml for this message.
     */
    return rndkXml.replace(/\"/g, '\'')
  }
}