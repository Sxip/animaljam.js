import { AnimalJamClientOptions } from './AnimalJamClientOptions'
import AsarRepository from './repositories/asar'
import { AudioRepository } from './repositories/audio'
import { AuthenticatorRepository } from './repositories/authenticator'
import { DefPackRepository } from './repositories/defpack'
import { FlashvarsRepository } from './repositories/flashvars'
import { NetworkingRepository } from './repositories/networking'
import { RoomRepository } from './repositories/room'
import { Request } from './request'

export class AnimalJamClient {
  /**
   * API Request handler.
   */
  public readonly request: Request = new Request()

  /**
   * Audio repository.
   */
  public readonly audio: AudioRepository = new AudioRepository(this)

  /**
   * Room repository.
   */
  public readonly room: RoomRepository = new RoomRepository(this)

  /**
   * Defpack repository.
   */
  public readonly defpack: DefPackRepository = new DefPackRepository(this)

  /**
   * Asar repository.
   */
  public readonly asar: AsarRepository = new AsarRepository(this)

  /**
   * Flashvars repository.
   */
  public readonly flashvars: FlashvarsRepository = new FlashvarsRepository(this)

  /**
   * Authenticator repository.
   */
  public readonly authenticator: AuthenticatorRepository = new AuthenticatorRepository(this)
  
  /**
   * Networking repository.
   */
  public readonly networking = NetworkingRepository 

  /**
   * Constructor.
   * @param options Options for the client.
   */
  public constructor ({ deployVersion = '1678' }: AnimalJamClientOptions = {}) {
    this.request.setDeployVersion(deployVersion)
  }
}
