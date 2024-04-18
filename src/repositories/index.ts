import { AnimalJamClient } from '../Client';

export abstract class Repository {
  /**
   * Constructor.
   * @param client The client that instantiated this request.
   */
  public constructor (private readonly client: AnimalJamClient) {}
}
