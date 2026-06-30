import { WildworksRepository } from "..";
import { Player } from "../player";
import { Buddies } from "../buddies";
import { Inventory } from "../inventory";

/**
 * Represents the local player with additional control methods.
 */
export class Me extends Player {
  public readonly buddies: Buddies;
  public readonly inventory: Inventory;

  public constructor(wildworks: WildworksRepository) {
    super(wildworks, "", "");
    this.buddies = new Buddies(wildworks, this);
    this.inventory = new Inventory(wildworks, this);
  }

  /**
   * Initialize player data after login.
   */
  public setPlayerData(data: {
    username: string;
    session?: string;
    uuid?: string;
    playerId?: string;
    gems?: number;
    diamonds?: number;
    tickets?: number;
  }): void {
    this.username = data.username;
    this.id = data.playerId || "";
    this.session = data.session;
    this.uuid = data.uuid;
    this.gems = data.gems;
    this.diamonds = data.diamonds;
    this.tickets = data.tickets;
  }

  /**
   * Get raw player data (for backwards compatibility).
   */
  public getPlayerData(): any {
    return {
      username: this.username,
      x: this.x,
      y: this.y,
      frame: this.frame,
      session: this.session,
      uuid: this.uuid,
      playerId: this.id,
      gems: this.gems,
      diamonds: this.diamonds,
      tickets: this.tickets,
    };
  }

  /**
   * Action API: Walk to a position.
   */
  public async walkTo(x: number, y: number, frame: number): Promise<void> {
    this.updatePosition(x, y, frame);

    await this.wildworks.sendXTMessage([
      "uc",
      x.toString(),
      y.toString(),
      frame.toString(),
    ]);
  }

  /**
   * User API: Join a room.
   */
  public async joinRoom(
    roomName: string,
    roomId: string = "-1",
  ): Promise<void> {
    await this.wildworks.sendRawMessage(
      `%xt%o%rj%-1%${roomName}#${roomId}%1%0%0%`,
    );
  }

  /**
   * User API: Send a chat message.
   */
  public async sendChat(message: string): Promise<void> {
    await this.wildworks.sendXTMessage(["cc", message]);
  }

  /**
   * Get player ID (alias for getId).
   */
  public getPlayerId(): string {
    return this.id;
  }
}
