export interface MasterpieceRepositoryOptions {
  /**
   * The path to the image to encode.
   */
  imagePath: string

  /**
   * The type of the masterpiece.
   */
  type?: 'aja2id' | 'aja2id2'

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