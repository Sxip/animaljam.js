import { Repository } from '..'
import { API_URL } from '../../Constants'
import { RoomRepositoryOptions } from './RoomRepositoryOptions'
import { RoomRepositoryResponse } from './RoomRepositoryResponse'

export class RoomRepository extends Repository {
  /**
   * Gets the defpack with the specified id.
   * @param id The id of the defpack to get.
   * @returns 
   */
  public async decode (map: string, options: RoomRepositoryOptions): Promise<RoomRepositoryResponse> {
    const file = `${options.file}.xroom`

    const response = await this.client.request.send<RoomRepositoryResponse>(
      `${API_URL}/[deploy_version]/roomDefs/${map}`,
      {
        method: 'GET',
        param: file,
      },
    )

    return response.data
  }
}