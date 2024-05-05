import { ANIMAL_JAM_BASE_URL } from "src/Constants";
import { Repository } from "..";

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