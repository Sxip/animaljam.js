import { NetworkingRepositoryOptions } from './NetworkingRepositoryOptions'
import { PacketHandler } from './PacketHandler'
import { RndKMessage } from './outgoing/rndK'
import { NetworkClient } from './client/NetworkClient'
import { HMAC_KEY } from '../../Constants'
import { readdir } from 'node:fs/promises'
import { createHmac } from 'node:crypto'
import { User } from './objects/user'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { XMLMessage } from './messages/XMLMessage'
import { JSONMessage } from './messages/JSONMessage'
import { XTMessage } from './messages/XTMessage'

export class NetworkingRepository extends NetworkClient {
  /**
   * Packet handler.
   */
  private readonly packetHandler: PacketHandler = new PacketHandler(this)

  /**
   * The user object.
   */
  public user: User | null = null

  /**
   * Event handlers.
   */
  public on (event: 'message', listener: (message: XMLMessage | JSONMessage | XTMessage) => void): this
  public on (event: 'ready', listener: (user: User) => void): this
  public on (event: 'received', listener: (message: any) => any): this
  public on (event: 'error', listener: (error: Error) => any): this
  public on (event: 'close', listener: () => any): this

  /**
   * Reconnect events.
   */
  public on (event: 'reconnect', listener: () => any): this
  public on (event: 'reconnecting', listener: ({ attempt, delay }: { attempt: number, delay: number }) => any): this
  public on (event: 'reconnect_failed', listener: (error: Error) => any): this
  public on (event: 'reconnect_error', listener: ({ attempt, delay }: { attempt: number, delay: number }) => any): this

  /**
   * Any other event.
   */
  public on (event: any, listener: (...args: any[]) => void): this {
    super.on(event, listener)
    return this
  }

  /**
   * Constructor.
   * @param options Options for the networking repository.
   * @constructor
   */
  public constructor (
    public readonly options: NetworkingRepositoryOptions
  ) {
    super({
      host: options.host,
      port: options.port,
      proxy: options.proxy,
      domain: options.domain ?? 'flash',

      reconnect: options.reconnect,
      reconnectDelay: options.reconnectDelay,
      reconnectAttempts: options.reconnectAttempts,
      maxReconnectAttempts: options.maxReconnectAttempts,
    })
  }

  /**
   * Creates a networking client.
   * @param options Options for the networking client.
   * @returns {Promise<NetifyClient<NullProtocol>>}
   */
  public static async createClient (options: NetworkingRepositoryOptions): Promise<NetworkingRepository> {
    if (options.domain !== 'mobile') options.host = `lb-${options.host.replace(/\.(stage|prod)\.animaljam\.internal$/, '-$1.animaljam.com')}`

    const networking = new NetworkingRepository({
      host: options.host,
      port: options.port,

      auth_token: options.auth_token,
      screen_name: options.screen_name,
      deploy_version: options.deploy_version,

      domain: options.domain ?? 'flash',
      proxy: options.proxy ?? undefined,

      reconnect: options.reconnect ?? false,
      reconnectDelay: options.reconnectDelay ?? 1000,
      reconnectAttempts: options.reconnectAttempts ?? 0,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 0,
    })

    await networking.usePacketHandlers()
    return networking
  }

  /**
   * Creates a connection to the server.
   * @returns {Promise<void>}
   */
  public async connect (): Promise<void> {
    await super.connect()


    this.on('received', this.onReceivedMessage.bind(this))

    this.sendRawMessage(RndKMessage.build())
  }

  /**
 * Handles sending a raw message.
 * @param message The message to send.
 * @returns {Promise<void>}
 */
  public async sendRawMessage (message: string): Promise<number> {
    return await this.write(message)
  }

  /**
   * Sends a xt message to the server.
   * @param args The arguments for the xt message.
   * @returns {Promise<number>}
   */
  public async sendXTMessage (args: string[]): Promise<number> {
     const message = `%xt%o%${args.join('%')}%`
     return await this.sendRawMessage(message)
  }

  /**
   * Creates a hmac message for Animal Jam Play Wild.
   * @param message The message to create the hmac for.
   * @returns {string}
   */
  public createHmacMessage (message: string): string {
    if (this.options.domain !== 'mobile') throw new Error('createHmacMessage is only supported for mobile')
    if (!this.user) throw new Error('user is not set, call connect() first')

    const secret = `${HMAC_KEY}${this.user.session}`
    message = `${message}${this.user.uuid}`
  
    return createHmac('sha256', secret)
      .update(message)
      .digest('base64')
  }

  /**
   * Loads the packet handlers.
   * @returns {Promise<void>}
   */
  public async usePacketHandlers (): Promise<void> {
    const handlers = await readdir(path.resolve(dirname(fileURLToPath(import.meta.url)), './incoming'), {
      recursive: true
    })

    for (const handler of handlers.filter(handler => /index\.(ts|js)$/i.test(handler))) 
      import(`./incoming/${handler}`)
  }

  /**
   * Waits for a message of the specified type.
   * @param type The type of message to wait for.
   * @param timeout The timeout in milliseconds.
   * @returns {Promise<XMLMessage | JSONMessage | XTMessage>}
   */
  public async waitForMessageOfType<T = XMLMessage | JSONMessage | XTMessage> (type: string, { timeout }: { timeout: number }): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const onMessage = (message: XMLMessage | JSONMessage | XTMessage) => {
        if (message.type === type) {
          this.off('message', onMessage)
          resolve(message as T)
        }
      }

      this.on('message', onMessage)

      setTimeout(() => {
        this.off('message', onMessage)
        reject(new Error(`Timeout waiting for message of type ${type}`))
      }, timeout)
    })
  }

  /**
   * Handles the received message buffer.
   * @param buffer The received message buffer.
   */
  private onReceivedMessage (buffer: Buffer): void {
    const message = buffer.toString()

    const validMessage = this.packetHandler.validate(message)
    if (validMessage) {
      validMessage.parse()

      this.packetHandler.handle(validMessage)
      this.emit('message', validMessage)
    }
  }

  /**
   * Closes the connection.
   */
  public async close (): Promise<void> {
    await super.close()
    this.emit('close')
  }
}
