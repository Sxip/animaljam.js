import { AnimalJamResponse } from 'src/request/AnimalJamResponse'
import { Repository } from '..'
import { API_URL, DEPLOY_VERSION } from '../../Constants'

export class DefPackRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode (id: string): Promise<AnimalJamResponse> {
    const response = await this.client.request.send<AnimalJamResponse>(
      `${API_URL}/${DEPLOY_VERSION}/defPacks`,
      {
        method: 'GET',
        param: id,
        rawDecompress: true
      },
    )

    return response.data
  }
}