import { EventEmitter } from 'node:events'
import { NetworkClientOptions } from './NetworkClientOptions'

import { createConnection } from 'node:net'
import { TLSSocket, connect as tlsConnect } from 'node:tls'
import { createConnectRequest, handleSocketResponse } from '../../../utils/proxy'
import { DelimiterTransform } from '../transform'


export class NetworkClient extends EventEmitter {
  private socket: TLSSocket | null = null

  /**
   * Constructor.
   * @param options The options for the client.
   */
  public constructor(
    public readonly options: NetworkClientOptions
  ) {
    super()
  }

  /**
   * Creates a new connection to the server.
   */
  public async connect(): Promise<void> {
    if (this.options.proxy) await this.createProxyConnection()
    else await this.createConnection()

    this.socket!
      .pipe(new DelimiterTransform(0x00))
      .on('data', data => this.emit('received', data))
      .on('close', () => this.emit('close'))
      .on('error', err => this.emit('error', err))
  }

  /**
   * Writes data to the socket.
   * @param data The data to write.
   */
  public async write(message: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const cleanup = () => {
        this.socket!.off('error', onError)
        this.socket!.off('close', onClose)
      }
  
      const onError = (err: Error) => {
        cleanup()
        reject(err)
      }
  
      const onClose = () => {
        cleanup()
        reject(new Error('Socket closed before the message could be sent'))
      }
  
      this.socket!.once('error', onError)
      this.socket!.once('close', onClose)
  
      const writable = this.socket!.write(message) && this.socket!.write('\x00')
      if (writable) {
        cleanup()
        resolve(message.length)
      } else {
        this.socket!.once('drain', () => {
          cleanup()
          resolve(message.length)
        })
      }
    })
  }

  /**
   * Creates a new connection to the server using a proxy.
   */
  private async createProxyConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const proxySocket = createConnection({
        host: this.options.proxy!.host,
        port: this.options.proxy!.port,
      })
  
      proxySocket.on('connect', () => {
        proxySocket.write(createConnectRequest(this.options.host, this.options.port, true))
      })
  
      proxySocket.once('data', (data) => {
        const { statusCode } = handleSocketResponse(data)
        if (statusCode === 200) {
          this.socket = tlsConnect({
            socket: proxySocket,
            host: this.options.host,
            port: this.options.port,
            rejectUnauthorized: false,
          })
          
          this.socket.once('secureConnect', () => resolve())
        } else {
          reject(new Error(`Proxy connection failed with status code ${statusCode}`))
          proxySocket.destroy()
        }
      })
  
      proxySocket.on('error', reject)
      proxySocket.on('close', () => reject(new Error('Proxy socket closed unexpectedly')))
    })
  }

  /**
   * Creates a new connection to the server.
   */
  private async createConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.socket = tlsConnect({
        host: this.options.host,
        port: this.options.port,
        rejectUnauthorized: false,
      })

      this.socket!.once('secureConnect', () => resolve())
      this.socket!.once('error', reject)
    })
  }
}