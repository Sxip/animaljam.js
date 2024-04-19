export interface DefPackDeserializeOptions {
  /**
   * Type of the defpack.
   */
  type?: string

  /**
   * Default defpack.
   */
  defaultDefpack: object

  /**
   * Defpack to deserialize.
   */
  defpack: object
}