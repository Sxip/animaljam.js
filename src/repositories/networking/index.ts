import { readdir } from 'fs/promises'
import { NetifyClient, NullProtocol } from 'netify.js'
import * as path from 'node:path'
import { NetworkingRepositoryOptions } from './NetworkingRepositoryOptions'
import { PacketHandler } from './PacketHandler'
import { JSONMessage } from './messages/JSONMessage'
import { XMLMessage } from './messages/XMLMessage'
import { XTMessage } from './messages/XTMessage'
import { RndKMessage } from './outgoing/rndK'

export class NetworkingRepository extends NetifyClient<NullProtocol>  {
  private readonly packetHandler: PacketHandler = new PacketHandler(this)

  /**
   * Event handlers.
   */
  public on (event: 'message', listener: (message: XMLMessage | JSONMessage | XTMessage) => void): this
  public on (event: 'received', listener: (message: any) => any): this
  public on (event: 'error', listener: (error: Error) => any): this
  public on (event: 'close', listener: () => any): this
  public on (event: any, listener: (...args: any[]) => void): this {
    super.on(event, listener);
    return this
  }

  /**
   * Constructor.
   * @param options Options for the networking repository.
   * @constructor
   */
  public constructor(
    public readonly options: NetworkingRepositoryOptions
  ) {
    super({
      host: options.host,
      port: options.port,
    })
  }

  /**
   * Creates a networking client.
   * @param options Options for the networking client.
   * @returns {Promise<NetifyClient<NullProtocol>>}
   */
  public static async createClient(options: NetworkingRepositoryOptions): Promise<NetworkingRepository> {
    options.host = `lb-${options.host.replace(/\.(stage|prod)\.animaljam\.internal$/, '-$1.animaljam.com')}`

    const networking = new NetworkingRepository({
      host: options.host,
      port: options.port,

      auth_token: options.auth_token,
      screen_name: options.screen_name,
      deploy_version: options.deploy_version,
    })
      .useProtocol(NullProtocol)

    await networking.usePacketHandlers()
    return networking
  }

  /**
   * Connects to the server.
   * @returns {Promise<void>}
   */
  public async usePacketHandlers(): Promise<void> {
    const handlers = await readdir(path.resolve(__dirname, './incoming'), {
      recursive: true
    })

    for (const handler of handlers.filter(handler => /\.(ts|js)$/i.test(handler)))
      import(`./incoming/${handler}`)
  }

  /**
   * Creates a connection to the server.
   * @returns {Promise<void>}
   */
  public async createConnection(): Promise<void> {
    await this.connect()

    this.on('received', this.onReceivedMessage.bind(this))

    // Send rndK packet to get the server's auth token
    this.sendRawMessage(RndKMessage.build())
  }

  /**
   * Handles the received message buffer.
   * @param buffer The received message buffer.
   */
  private onReceivedMessage(buffer: Buffer): void {
    const message = buffer.toString()

    const validMessage = this.packetHandler.validate(message)
    if (validMessage) {
      validMessage.parse()

      this.packetHandler.handle(validMessage)
      this.emit('message', validMessage)
    }
  }

  /**
   * Handles sending a raw message.
   * @param message The message to send.
   * @returns {Promise<void>}
   */
  public async sendRawMessage(message: string): Promise<void> {
    this.write(message)
    this.write('\x00')

    await this.flush()
  }
}
