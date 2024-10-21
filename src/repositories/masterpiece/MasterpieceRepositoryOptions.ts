export interface MasterpieceEncodeRepositoryOptions {
  /**
   * The path to the image to encode.
   */
  imagePath: string

  /**
   * The type of the masterpiece.
   */
  type?: 'aja2id' | 'ajg1id'

  /**
   * User uuid.
   */
  uuid: string

  /**
   * Whether to save the file to the specified path.
   */
  saveFile?: boolean

  /**
   * The path to save the file to.
   */
  saveFileMasterpiecePath?: string,
}

export interface MasterpieceDecodeRepositoryOptions {
  /**
   * The path to the masterpiece to decode.
   */
  masterpiecePath: string

  /**
   * User uuid.
   */
  uuid: string

  /**
   * Whether to save the file to the specified path.
   */
  saveFile?: boolean

  /**
   * The path to save the file to.
   */
  saveFileMasterpiecePath?: string,
}