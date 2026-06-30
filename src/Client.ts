import { AnimalJamClientOptions } from "./AnimalJamClientOptions";
import { AuthenticatorRepository } from "./repositories/authenticator";
import { DefPackRepository } from "./repositories/defpack";
import { FlashvarsRepository } from "./repositories/flashvars";
import { MasterpieceRepository } from "./repositories/masterpiece";
import { WildworksRepository } from "./repositories/wildworks";
import { ProxyRepository } from "./repositories/proxy";
import { RoomRepository } from "./repositories/room";
import { Request } from "./request";

export class AnimalJamClient {
  /**
   * API Request handler.
   */
  public readonly request: Request = new Request();

  /**
   * Room repository.
   */
  public readonly room: RoomRepository = new RoomRepository(this);

  /**
   * Defpack repository.
   */
  public readonly defpack: DefPackRepository = new DefPackRepository(this);

  /**
   * Flashvars repository.
   */
  public readonly flashvars: FlashvarsRepository = new FlashvarsRepository(
    this,
  );

  /**
   * Authenticator repository.
   */
  public readonly authenticator: AuthenticatorRepository =
    new AuthenticatorRepository(this);

  /**
   * Proxy repository.
   */
  public readonly proxy: ProxyRepository = new ProxyRepository(this);

  /**
   * Masterpiece repository.
   */
  public readonly masterpiece: MasterpieceRepository =
    new MasterpieceRepository(this);

  /**
   * Wildworks repository.
   */
  public readonly wildworks = WildworksRepository;

  /**
   * Constructor.
   * @param options Options for the client.
   */
  public constructor({ deployVersion = "1678" }: AnimalJamClientOptions = {}) {
    this.request.setDeployVersion(deployVersion);
  }
}
