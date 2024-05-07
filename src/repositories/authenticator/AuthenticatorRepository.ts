import { Repository } from '..'
import { ANIMAL_JAM_AUTHENTICATOR } from '../../Constants'
import { AuthenticatorRepositoryResponse } from './AuthenticatorRepositoryResponse'
import { LoginOptions } from './LoginOptions'

export class AuthenticatorRepository extends Repository {
  /**
   * Authenticates the client.
   * @param options Options for the authentication.
   * @returns {Promise<void>}
   */
  public async login (options: LoginOptions): Promise<AuthenticatorRepositoryResponse> {
    const response = await this.client.request.send<AuthenticatorRepositoryResponse>(
      `${ANIMAL_JAM_AUTHENTICATOR}/authenticate`,
      {
        method: 'POST',
        body: JSON.stringify({
          username: options.screenName,
          password: options.password,
          domain: 'flash'
        }),
      },
    )

   return response.data
  }
}