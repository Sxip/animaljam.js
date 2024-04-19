import { AMF3, AMFDecoder } from 'amfjs'
import { defaultsDeep } from 'lodash'
import { createHash } from 'node:crypto'
import { Readable } from 'node:stream'
import { inflate, inflateRaw } from 'zlib'
import { AnimalJamClient } from '../Client'
import { HASH_KEY } from '../Constants'
import { AnimalJamRequestOptions } from './AnimalJamRequestOptions'
import { AnimalJamResponse } from './AnimalJamResponse'

export class Request {
  /**
   * Default headers for all requests.
   */
  private readonly deaultHeaders = {
    'Host': 'ajcontent.akamaized.net',
  }

  /**
   * Constructor.
   * @param client The client that instantiated this request.
   */
  public constructor(private readonly client: AnimalJamClient) { }

  /**
   * Sends a request to the server.
   * @param url The url to request.
   * @param userOptions Default options for the request.
   * @returns Promise<AnimalJamResponse<T>>
   */
  public async send<T = any>(url: string, userOptions: AnimalJamRequestOptions): Promise<AnimalJamResponse<T>> {
    const options = defaultsDeep(userOptions, {
      headers: {
        ...this.deaultHeaders,
      },
    })


    if (options.param) url = `${url}/${this.hash(options.param)}`

    const response = await fetch(url, options)

    const animalResponse: AnimalJamResponse<T> = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    switch (animalResponse.headers.get('Content-Type')) {
      case 'audio/mpeg':
        animalResponse.data = Buffer.from(await response.arrayBuffer())
        break
      case 'binary/octet-stream':
        const buffer = Buffer.from(await response.arrayBuffer())
        animalResponse.data = await this.decompress(buffer, options.rawDecompress)
        break
      default:
        animalResponse.data = await response.text()
    }

    return animalResponse
  }

  /**
   * Decompresses a buffer.
   * @param buffer The buffer to decompress.
   * @returns {Promise<object>}
   */
  private async decompress(buffer: Buffer, rawDecompress: boolean): Promise<object> {
    const decompressed = await new Promise<Buffer>((resolve, reject) => rawDecompress ? inflateRaw(buffer, (error, decoded) => {
      if (error) reject(error)
      else resolve(decoded)
    }) : inflate(buffer, (error, decoded) => {
      if (error) reject(error)
      else resolve(decoded)
    }))

    const stream = new Readable()
    stream.push(decompressed)
    stream.push(null)

    const decoder = new AMFDecoder(stream)
    return decoder.decode(AMF3);
  }

  /**
   * Hashes input string.
   * @param input The input string to hash.
   * @returns {string}
   */
  private hash(input: string): string {
    let increment = 0
    let output = ''

    input = `${HASH_KEY}${input}`

    while (increment < input.length) {
      if (increment % 2 == 0) {
        output = output + input.charAt(increment)
      } else {
        output = input.charAt(increment) + output
      }
      increment++
    }

    return createHash('md5')
      .update(output)
      .digest('hex')
  }
}
