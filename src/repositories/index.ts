import { existsSync } from 'fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { AnimalJamClient } from '../Client'

export abstract class Repository {
  /**
   * Constructor.
   * @param client The client that instantiated this request.
   */
  public constructor (public readonly client: AnimalJamClient) {}

  /**
   * Abstract method to decode an asset.
   * @param name Name of the asset to decode.
   * @param options Options for the decoding.
   * @returns {Promise<any>}
   */
  public decode? (...args: any[]): Promise<any>

  /**
   * Saves an audio file.
   * @param path The path to save the file to.
   * @param buffer The buffer of the audio file.
   * @returns {Promise<void>}
   */
  protected async saveAssetFile (name: string, path: string, buffer: Buffer): Promise<void> {
    const pathToSave = `${path}/${name}`

    if (!existsSync(path)) await mkdir(path, { recursive: true })
    await writeFile(pathToSave, buffer)
  }
}
