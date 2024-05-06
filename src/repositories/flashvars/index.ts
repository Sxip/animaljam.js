import { Repository } from '..';
import { ANIMAL_JAM_BASE_URL } from '../../Constants';
import { FlashvarsRepositoryResponse } from './FlashvarsRepositoryResponse';

export class FlashvarsRepository extends Repository {
  /**
   * Fetches the flashvars..
   */
  public async fetch (): Promise<FlashvarsRepositoryResponse> {
    const response = await this.client.request.send<FlashvarsRepositoryResponse>(
      `${ANIMAL_JAM_BASE_URL}/flashvars`,
      {
        method: 'GET',
        includeHost: false,
        headers: { 
          'User-Agent': 'animaljam.js',
          'Accept': 'application/json',
        }
      },
    )

    
    return response.data
  }
}