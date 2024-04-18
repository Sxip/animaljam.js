import { createHash } from 'crypto'
import { defaultsDeep } from 'lodash'
import { HASH_KEY } from 'src/Constants'
import { AnimalJamClient } from '../Client'
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
  public constructor (private readonly client: AnimalJamClient) {}

  /**
   * Sends a request to the server.
   * @param url The url to request.
   * @param userOptions Default options for the request.
   * @returns Promise<AnimalJamResponse<T>>
   */
  public async send (url: string, userOptions: AnimalJamRequestOptions): Promise<AnimalJamResponse<T>> {
    const options = defaultsDeep(userOptions, {
      headers: {
        ...this.deaultHeaders,
      },
    })

    if (options.hash) url = `${url}/${this.hash(options.hash)}`

    const response = await fetch(url, options)

    const animalResponse: AnimalJamResponse = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    switch (animalResponse.headers.get('Content-Type')) {
      case 'audio/mpeg':
        console.log('aaudio/mpeg')
        animalResponse.data = await response.arrayBuffer()
        break
      default:
        animalResponse.data = await response.text()
    }

    return animalResponse
  }

  /**
   * Hashes input string.
   * @param input The input string to hash.
   * @returns {string}
   */
  private hash (input: string): string {
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
