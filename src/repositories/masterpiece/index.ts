import { Repository } from '..'
import { MasterpieceRepositoryOptions } from './MasterpieceRepositoryOptions'
import { readFile } from 'node:fs/promises'
import { Writable } from 'node:stream'
import { deflate } from 'node:zlib'
import { createCipheriv } from 'node:crypto'
import sharp from 'sharp'

export class MasterpieceRepository extends Repository {
  /**
   * Converts an image to a masterpiece.
   * @param options Options for the conversion.
   */
  public async encode ({ type = 'aja2id', ...options }: MasterpieceRepositoryOptions): Promise<void | Buffer> {
    const buffer = await readFile(options.imagePath)

    // Always resize the image before compressing it.
    const resizedImage = await sharp(buffer)
      .resize(760, 460)
      .toBuffer()

    const [key, iv] = this.getKeys(options.uuid)
    const compressedImage = await this.decompress(resizedImage, type, options.uuid)
    const encryptedImage = this.encrypt(compressedImage, key, iv)

    // Saves the image to the specified path if the saveFile option is true.
    if (options.saveFile) {
      if (!options.saveFileMasterpiecePath) throw new Error('saveFileMasterpiecePath is required when saveFile is true.');

      const fileName = `masterpiece-${new Date().getTime()}.${type === 'aja2id' ? 'ajart' : 'ajgart'}`
      return await this.saveAssetFile(fileName, options.saveFileMasterpiecePath, encryptedImage)
    }

    return compressedImage
  }

  /**
   * Compresses the image.
   * @param image The image to compress.
   * @param key The key to use.
   * @param iv The iv to use.
   */
  private async decompress (image: Buffer, type: string, uuid: string): Promise<Buffer | null> {
    const amfjs = await import('amfjs')
    const { AMFEncoder } = amfjs.default ?? amfjs

    return new Promise<Buffer>((resolve, reject) => {
      const data: Buffer[] = []

      let totalSize = 0
      const ws = new Writable({
        write(chunk, _encoding, callback) {
          totalSize += chunk.length
          data.push(chunk)
          callback()
        },
        final(callback) {
          const buffer = Buffer.concat(data, totalSize)
          deflate(buffer, { level: 9 }, (err, compressed) => {
            if (err) return reject(err)
            resolve(compressed)
          })
          callback()
        }
      })

      const encoder = new AMFEncoder(ws)
      encoder.writeObject({
        b: image,
        h: type,
        p: uuid
      },
        amfjs.AMF3
      )
      ws.end()
    })
  }

  /**
   * Gets the keys from the uuid.
   * @param uuid The uuid to get the keys from.
   */
  private getKeys (uuid: string): Buffer[] {
    const keyLength = 16

    const keyArray = Buffer.allocUnsafe(keyLength)
    const ivArray = Buffer.allocUnsafe(keyLength)

    for (let i = 0, counter = 0; i < keyLength; i++) {
      keyArray[i] = uuid.charCodeAt(counter++)
      ivArray[i] = uuid.charCodeAt(counter++)
    }

    return [keyArray, ivArray];
  }

  /**
   * Encrypts the image.
   * @param buffer The buffer to encrypt.
   * @param key The key to use.
   * @param iv The iv to use.
   */
  private encrypt (buffer: Buffer, key: Buffer, iv: Buffer) {
    const cipher = createCipheriv('aes-128-cbc', key, iv)
    return Buffer.concat([cipher.update(buffer), cipher.final()])
  }
}