import { Repository } from '..'
import { API_URL } from '../../Constants'
import { DefPackDeserializeOptions } from './DefPackDeserializeOptions'
import { DefPackRepositoryOptions } from './DefPackRepositoryOptions'

export class DefPackRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode(id: string, { type = 'nameStrId', ...options }: DefPackRepositoryOptions): Promise<object> {
    const name = `${id}.json`

    const [defaultDefpack, defpack] = await Promise.all([
      /**
       * Request the default defpack items.
       */
      this.getDefaultDefpack(),

      /**
       * Request the defpack with the specified id.
       */
      this.client.request.send<object>(
        `${API_URL}/[deploy_version]/defPacks`,
        {
          method: 'GET',
          param: id,
          rawDecompress: true
        },
      )
    ])

    const deserializedDefpack = this.deserialize({
      type,
      defaultDefpack,
      defpack: defpack.data
    })

    if (options?.saveFile) {
      const path = options?.saveFileDefpackPath ?? `./${name}`
      await this.saveAssetFile(name, path, Buffer.from(JSON.stringify(deserializedDefpack, null, 2)))
    }

    return deserializedDefpack
  }

  /**
   * Requests the default defpack items.
   * @returns {Promise<object>}
   */
  private async getDefaultDefpack(): Promise<object> {
    const response = await this.client.request.send<object>(
      `${API_URL}/[deploy_version]/defPacks`,
      {
        method: 'GET',
        param: '10230',
        rawDecompress: true,
        objectMode: false
      },
    )

    return response.data
  }

  /**
   * Deserializes the defpack.
   * @param defpack The defpack to deserialize.
   * @returns {object}
   * @param defpack 
   */
  private deserialize(options: DefPackDeserializeOptions): object {
    for (const obj in options.defpack) {
      if (options.defpack[obj]?.hasOwnProperty(options.type)) 
        options.defpack[obj].name = options.defaultDefpack[options.defpack[obj][options.type]];
    }

    return options.defpack
  }
}