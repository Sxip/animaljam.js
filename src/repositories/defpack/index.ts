import { Repository } from '..'
import { API_URL, DEPLOY_VERSION } from '../../Constants'

export class DefPackRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode (id: string): Promise<any> {
    const response = await this.client.request.send(
      `${API_URL}/${DEPLOY_VERSION}/defPacks/`,
      {
        method: 'GET',
        param: id,
        rawDecompress: true
      },
    )

    return response.data
  }
}