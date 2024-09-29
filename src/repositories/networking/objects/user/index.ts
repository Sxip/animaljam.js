import { UserObjectContract } from './UserObjectContract'

export class User implements UserObjectContract {
  /**
   * The username of the user.
   */
  public username: string;

  /**
   * The uuid of the user.
   */
  public uuid: string;

  /**
   * The session id of the user.
   */
  public session: string;

  /**
   * Constructor.
   * @param options The options to set.
   */
  public constructor (options: UserObjectContract) {
    this.username = options.username
    this.uuid = options.uuid
    this.session = options.session
  }
}