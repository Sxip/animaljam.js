import { AudioRepository } from './repositories/audio'
import { DefPackRepository } from './repositories/defpack'
import { RoomRepository } from './repositories/room'
import { Request } from './request'

export class AnimalJamClient {
  /**
   * API Request handler.
   */
  public readonly request: Request = new Request(this)

  /**
   * Audio repository.
   */
  public readonly audio: AudioRepository = new AudioRepository(this)

  /**
   * Room repository.
   */
  public readonly room: RoomRepository = new RoomRepository(this)


  /**
   * Room repository.
   */
  public readonly defpack: DefPackRepository = new DefPackRepository(this)
}
