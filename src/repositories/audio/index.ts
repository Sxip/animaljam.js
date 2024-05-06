import { Repository } from '..'
import { API_URL } from '../../Constants'
import { AudioRepositoryOptions } from './AudioRepositoryOptions'

export class AudioRepository extends Repository {
  /**
   * Decodes an audio file.
   * @param name The name of the audio file.
   * @returns {Promise<ArrayBuffer>}
   */
  public async decode (name: string, options?: AudioRepositoryOptions): Promise<Buffer> {
    name = `${name}.mp3`

    const response = await this.client.request.send<Buffer>(
      `${API_URL}/[deploy_version]/audio`,
      {
        method: 'GET',
        param: name,
      },
    )

    if (options?.saveFile) {
      const path = options?.saveFileAudioPath ?? `./${name}`
      await this.saveAssetFile(name, path, response.data)
    }

    return response.data
  }
}
