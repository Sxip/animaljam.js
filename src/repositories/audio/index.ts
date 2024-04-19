import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { AnimalJamResponse } from 'src/request/AnimalJamResponse'
import { Repository } from '..'
import { API_URL, DEPLOY_VERSION } from '../../Constants'
import { AudioRepositoryOptions } from './AudioRepositoryOptions'

export class AudioRepository extends Repository {
  /**
   * Decodes an audio file.
   * @param name The name of the audio file.
   * @returns {Promise<ArrayBuffer>}
   */
  public async decode (name: string, options?: AudioRepositoryOptions): Promise<AnimalJamResponse> {
    name = `${name}.mp3`

    const response = await this.client.request.send(
      `${API_URL}/${DEPLOY_VERSION}/audio`,
      {
        method: 'GET',
        param: name,
      },
    )

    if (options?.saveFile) {
      const path = options?.saveFileAudioPath ?? `./${name}`
      await this.saveAudioFile(name, path, response.data)
    }

    return response.data
  }

  /**
   * Saves an audio file
   * @param path The path to save the file to.
   * @param buffer The buffer of the audio file.
   * 
   */
  private async saveAudioFile (name: string, path: string, buffer: Buffer): Promise<void> {
    const pathToSave = `${path}/${name}`

    if (!existsSync(path)) await mkdir(path, { recursive: true })
    await writeFile(pathToSave, buffer)
  }
}
