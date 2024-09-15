export interface Proxy {
  host: string
  port: number
}

/**
 * Handles parsing the response from the proxy.
 * @param data The data to parse.
 */
export function handleSocketResponse(data: Buffer): { statusCode: number, statusMessage: string } {
  const responseString = data.toString('utf-8')
  const [statusLine] = responseString.split('\r\n')
  const [_, statusCode, statusMessage] = statusLine.split(' ')

  return {
    statusCode: parseInt(statusCode, 10),
    statusMessage: statusMessage || ''
  }
}

/**
 * Creates a connection request to the proxy.
 * @param targetHost The target host to connect to.
 * @param targetPort The target port to connect to.
 */
export function createConnectRequest(targetHost: string, targetPort: number, keepAlive: boolean = false): Buffer {
  const request = [
    `CONNECT ${targetHost}:${targetPort} HTTP/1.1`,
    `Host: ${targetHost}`,
    keepAlive && 'Proxy-Connection: Keep-Alive',
    keepAlive && 'Connection: Keep-Alive',
    '\r\n'
  ].join('\r\n')

  return Buffer.from(request)
}