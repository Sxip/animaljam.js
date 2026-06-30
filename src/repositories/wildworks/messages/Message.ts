export abstract class Message<T> {
  public type: string
  public message: T

  /**
   * Constructor.
   * @param message The message to parse.
   * @constructor
   */
  public constructor (public readonly messageRaw: string) {}

  /**
   * Handles the parsing of the message.
   * @returns {void}
   */
  public abstract parse (): void

  /**
   * Converts the message to a string.
   * @returns {string}
   */
  public abstract toMessage (): string
}