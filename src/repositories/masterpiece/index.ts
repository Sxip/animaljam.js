import { createCipheriv, createDecipheriv } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { Writable } from 'node:stream'
import { deflate, inflate } from 'node:zlib'
import sharp from 'sharp'
import { Repository } from '..'
import { MasterpieceDecodeRepositoryOptions, MasterpieceEncodeRepositoryOptions } from './MasterpieceRepositoryOptions'

export class MasterpieceRepository extends Repository {
  /**
   * Converts an image to a masterpiece.
   * @param options Options for the conversion.
   */
  public async encode ({ type = 'aja2id', ...options }: MasterpieceEncodeRepositoryOptions): Promise<void | Buffer> {
    const buffer = await readFile(options.imagePath)

    // Always resize the image before compressing it.
    const resizedImage = await sharp(buffer)
      .resize(760, 460)
      .toBuffer()

    const [key, iv] = this.getKeys(options.uuid)
    const compressedImage = await this.compress(resizedImage, type, options.uuid)
    const encryptedImage = this.encrypt(compressedImage, key, iv)

    // Saves the image to the specified path if the saveFile option is true.
    if (options.saveFile) {
      if (!options.saveFileMasterpiecePath) throw new Error('saveFileMasterpiecePath is required when saveFile is true.');

      const fileName = `masterpiece-${new Date().getTime()}.${type === 'aja2id' ? 'ajart' : 'ajgart'}`
      return await this.saveAssetFile(fileName, options.saveFileMasterpiecePath, encryptedImage)
    }

    return encryptedImage
  }

  /**
   * Decodes a masterpiece.
   */
  public async decode (options: MasterpieceDecodeRepositoryOptions): Promise<void | Buffer> {
    const buffer = await readFile(options.masterpiecePath)
    const [key, iv] = this.getKeys(options.uuid)

    const decryptedImage = this.decrypt(buffer, key, iv)
    const image = await this.decompress(decryptedImage)

    if (options.saveFile) {
      if (!options.saveFileMasterpiecePath) throw new Error('saveFileMasterpiecePath is required when saveFile is true.');

      const fileName = `masterpiece-${new Date().getTime()}.jpg`
      return await this.saveAssetFile(fileName, options.saveFileMasterpiecePath, image)
    }

    return image
  }

  /**
   * Compresses the image.
   * @param image The image to compress.
   * @param key The key to use.
   * @param iv The iv to use.
   */
  private async compress (image: Buffer, type: string, uuid: string): Promise<Buffer | null> {
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
   * Decompresses the image.
   * @param image The image to decompress.
   */
  public async decompress (image: Buffer): Promise<Buffer> {
    const amfjs = await import('amfjs')
    const { AMFDecoder } = amfjs.default ?? amfjs

    return new Promise<Buffer>((resolve, reject) => {
      inflate(image, (error, decoded) => {
        if (error) return reject(error)
        
        const decoder = new AMFDecoder(decoded)
        const { b } = decoder.decode(amfjs.AMF3)
        return resolve(b)
      })
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

  /**
   * Decrypts the image.
   * @param buffer The buffer to encrypt.
   * @param key The key to use.
   * @param iv The iv to use.
   */
  private decrypt (buffer: Buffer, key: Buffer, iv: Buffer): Buffer {
    const decipher = createDecipheriv('aes-128-cbc', key, iv)
      .setAutoPadding(false)
    
    return Buffer.concat([decipher.update(buffer), decipher.final()])
  }
}