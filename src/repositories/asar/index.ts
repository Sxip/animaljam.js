import { extractAll } from '@electron/asar'
import path from 'node:path'
import { homedir, platform } from 'os'
import { Repository } from '..'
import { AsarUnpackOptions } from './AsarUnpackOptions'

export default class AsarRepository extends Repository {
  /**
   * Gets the base asar path.
   * @private
   */
  private get getBaseAsarPath(): string {
    switch (platform()) {
      case 'darwin':
        return '/Applications/Animal Jam Classic.app/Contents/Resources/asar'
     
      case 'win32':
        return `${path.join(homedir())
          .split('\\')
          .join('/')}/AppData/Local/Programs/aj-classic/resources/app.asar`
    }
  }

  /**
   * Unpacks the asar file and saves it to the specified path.
   * @param options Options for the unpacking.
   * @returns {Promise<void>}
   */
  public async unpack(options?: AsarUnpackOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        resolve(extractAll(this.getBaseAsarPath, options?.saveFileAsarPath ?? `./asar`))
      } catch (error) {
        reject(error)
      }
    })
  }
}