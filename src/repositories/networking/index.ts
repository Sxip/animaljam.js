import { NetifyClient, NullProtocol } from 'netify.js'
import { NetworkingRepositoryOptions } from './NetworkingRepositoryOptions'
import { PacketHandler } from './packets'

export class NetworkingRepository extends NetifyClient<NullProtocol> {
  private readonly packetHandler: PacketHandler = new PacketHandler(this)

  /**
   * Constructor.
   * @param options Options for the networking repository.
   * @constructor
   */
  public constructor (options: NetworkingRepositoryOptions) {
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
  public static async createClient (options: NetworkingRepositoryOptions): Promise<NetworkingRepository> {
    options.host = `lb-${options.host.replace(/\.(stage|prod)\.animaljam\.internal$/, '-$1.animaljam.com')}`

    return new NetworkingRepository({
      host: options.host,
      port: options.port,

      authToken: options.authToken,
      screenName: options.screenName,
    })
    .useProtocol(NullProtocol)
    .usePacketHandler()
  }

  /**
   * Connects to the server.
   * @returns {Promise<void>}
   */
  public usePacketHandler (): this  {
    return this
  }

  /**
   * Creates a connection to the server.
   * @returns {Promise<void>}
   */
  public async createConnection (): Promise<void> {
    await this.connect()

    this.on('received', this.onReceivedMessage.bind(this))
    this.on('close', this.onClose.bind(this))
  }

  /**
   * Handles the received message buffer.
   * @param buffer The received message buffer.
   */
  private onReceivedMessage (buffer: Buffer): void {
    const message = buffer.toString()

    this.packetHandler.handleMessageReceived(message)
  }

  /**
   * Handles sending a raw message.
   * @param message The message to send.
   * @returns {Promise<void>}
   */
  public async sendRawMessage (message: string): Promise<void> {
    this.write(message)
    this.write('\x00')
    await this.flush()
  }
  

  /**
   * Handles the close event.
   * @returns {void}
   */
  private onClose (): void {
    
  }
}