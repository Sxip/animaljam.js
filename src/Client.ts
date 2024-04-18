import { AudioRepository } from './repositories/audio'
import { Request } from './request'

export class AnimalJamClient {
  /**
   * API Request handler.
   */
  public readonly request: Request = new Request(this)

  /**
   * Room repository.
   */
  public readonly audio: AudioRepository = new AudioRepository(this)
}
