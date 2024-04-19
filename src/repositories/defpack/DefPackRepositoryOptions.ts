export interface DefPackRepositoryOptions {
  /**
   * Whether to save the defpack file to the specified path.
   */
  saveFile?: boolean

  /**
   * The path to save the defpack file to.
   */
  saveFileDefpackPath?: string,

  /**
   * Defpack type.
   */
  type?: 'nameStrId' | 'titleStrRef' | 'streamTitleStrRef' | 'titleStrId'
}