import { Repository } from '..'
import { API_URL, DEPLOY_VERSION } from '../../Constants'
import { DefPackRepositoryOptions } from './DefPackRepositoryOptions'

export class DefPackRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode(id: string, options?: DefPackRepositoryOptions): Promise<object> {
    const response = await this.client.request.send<object>(
      `${API_URL}/${DEPLOY_VERSION}/defPacks`,
      {
        method: 'GET',
        param: id,
        rawDecompress: true
      },
    )

    return response
  }
}