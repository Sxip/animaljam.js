import { ANIMAL_JAM_AUTHENTICATOR } from '../../Constants'
import { Repository } from '..'
import { Proxy, ProxyRepositoryOptions, ProxyRepositoryResponse } from './ProxyRepositoryOptions'
import { HttpProxyAgent } from 'http-proxy-agent'
import pLimit from 'p-limit'
import { createConnection } from 'node:net'

export class ProxyRepository extends Repository {
  /**
   * Timeout for the proxy test.
   */
  public timeout: number

  /**
   * Tests all proxies to see if they are working.
   * @param proxies The proxies to test.
   */
  public async test ({ concurrency = 10, timeout = 5000, ...options }: ProxyRepositoryOptions): Promise<ProxyRepositoryResponse[]> {
    this.timeout = timeout

    /**
     * Limit the number of concurrent requests.
     * This is to prevent memory usage from growing too much.
     */
    const limit = pLimit(concurrency)

    /**
     * Map the proxies to a function that returns a promise.
     */
    const proxies = options.proxies.map(proxy => limit(() => {
      if (proxy.type === 'http') return this.http(proxy)
      else if (proxy.type === 'socks5') return this.socks(proxy)
      else throw new Error('Invalid proxy type')
    }))

    return await Promise.all(proxies)
  }

  /**
   * Tests a http proxy to see if it is working.
   * Defaults to the authenticator url as if it's working here then it's working for all other urls.
   * @param proxy The proxy to test.
   * @returns
   */
  private async http (proxy: Proxy): Promise<ProxyRepositoryResponse> {
    const proxyUrl = `https://${proxy.host}:${proxy.port}`
    const agent = new HttpProxyAgent(proxyUrl)

    try {

      await this.client.request.send(ANIMAL_JAM_AUTHENTICATOR, {
        method: 'GET',
        includeHost: false,
        headers: {
          'host': 'authenticator.animaljam.com',
        },
        agent: agent,
      })

      /**
       * If the response status is 200, the proxy is working.
       */
      return { proxy, isWorking: true }
    } catch (error) {
      console.log(error)
      return { proxy, isWorking: false }
    }
  }

  /**
   * Creates a connection request to the proxy.
   * @param targetHost The target host to connect to.
   * @param targetPort The target port to connect to.
   */
  private createConnectRequest (targetHost: string, targetPort: number): Buffer {
    const request = [
      `CONNECT ${targetHost}:${targetPort} HTTP/1.1`,
      `Host: ${targetHost}`,
      '\r\n'
    ].join('\r\n')

    return Buffer.from(request)
  }

  /**
   * Handles parsing the response from the proxy.
   * @param data The data to parse.
   */
  private handleSocketResponse (data: Buffer): { statusCode: number, statusMessage: string } {
    const responseString = data.toString('utf-8')
    const [statusLine] = responseString.split('\r\n')
    const [_, statusCode, statusMessage] = statusLine.split(' ')

    return {
      statusCode: parseInt(statusCode, 10),
      statusMessage: statusMessage || ''
    }
  }

  /**
   * Tests a socks5 proxy to see if it is working.
   * We don't need to test TLS because Animal Jam handles raw socket connection to test the proxy, so if raw sockets are working, the proxy is working.
   * @param proxy The proxy to test.
   */
  private async socks (proxy: Proxy): Promise<ProxyRepositoryResponse> {
    /**
     * Server is almost always online so we don't need to change it?
     * Maybe we can use a different server?
     * I say we.. but, i'm talking to myself.
     */
    const connectRequest = this.createConnectRequest(`lb-iss02-classic-prod.animaljam.com`, 443)

    const proxySocket = createConnection({
      host: proxy.host,
      port: proxy.port,
    })

    let connectionTimeoutId: NodeJS.Timeout
    let dataTimeoutId: NodeJS.Timeout

    return new Promise<ProxyRepositoryResponse>((resolve) => {
      proxySocket.once('timeout', () => {
        proxySocket.destroy()
        clearTimeout(dataTimeoutId)
        resolve({ proxy, isWorking: false })
      })
  
      proxySocket.once('connect', () => {
        clearTimeout(connectionTimeoutId)
        proxySocket.write(connectRequest)
  
        dataTimeoutId = setTimeout(() => {
          proxySocket.destroy()
          resolve({ proxy, isWorking: false })
        }, this.timeout)
      })
  
      proxySocket.once('data', async (data: Buffer) => {
        clearTimeout(dataTimeoutId)
        const { statusCode } = this.handleSocketResponse(data)
        if (statusCode === 200) {
          proxySocket.end()
          resolve({ proxy, isWorking: true })
        } else {
          proxySocket.end()
          resolve({ proxy, isWorking: false })
        }
      })
  
      proxySocket.once('error', (err) => {
        console.error('Socket error:', err.message)
        clearTimeout(connectionTimeoutId)
        clearTimeout(dataTimeoutId)
        proxySocket.destroy()
        resolve({ proxy, isWorking: false })
      })
  
      proxySocket.once('close', () => {
        clearTimeout(connectionTimeoutId)
        clearTimeout(dataTimeoutId)
        proxySocket.destroy()
        resolve({ proxy, isWorking: false })
      })
  
      connectionTimeoutId = setTimeout(() => {
        proxySocket.destroy()
        resolve({ proxy, isWorking: false })
      }, this.timeout)
    })
  }
}
