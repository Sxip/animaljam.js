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
        includeHost: false,
        headers: {
          'host': 'authenticator.animaljam.com',
          'User-Agent': 'UnityPlayer/2020.3.40f1 (UnityWebRequest/1.0, libcurl/7.84.0-DEV)',
        },
        body: JSON.stringify({
          username: options.screen_name,
          password: options.password,
          domain: options.domain ?? 'flash',
        }),
        proxy: options.proxy ?? undefined,
      },
    )
    
   return response.data
  }
}