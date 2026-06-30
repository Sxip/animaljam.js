import { WildworksRepository } from "..";
import { Player } from "../player";

export class GameMap {
  private players: Map<string, Player> = new Map();
  private currentRoom: string | null = null;

  public constructor(private readonly wildworks: WildworksRepository) {}

  /**
   * User API: Find players in range.
   */
  public findPlayersInRange(x: number, y: number, range: number): Player[] {
    const result: Player[] = [];
    for (const player of this.players.values()) {
      const distance = Math.sqrt(
        Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2),
      );
      if (distance <= range) {
        result.push(player);
      }
    }
    return result;
  }

  /**
   * User API: Find player by username.
   */
  public findPlayerByUsername(username: string): Player | null {
    for (const player of this.players.values()) {
      if (player.username === username) {
        return player;
      }
    }
    return null;
  }

  /**
   * Incoming packet handler: Player joined the room.
   */
  public playerJoined(
    id: string,
    username: string,
    x: number = 0,
    y: number = 0,
    frame: number = 0,
  ): void {
    const player = new Player(this.wildworks, id, username);
    player.updatePosition(x, y, frame);
    this.players.set(id, player);
  }

  /**
   * Get or create player.
   */
  public getOrCreatePlayer(id: string, username: string): Player {
    let player = this.players.get(id);
    if (!player) {
      player = new Player(this.wildworks, id, username);
      this.players.set(id, player);
    }
    return player;
  }

  /**
   * Get player by ID.
   */
  public getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  /**
   * Incoming packet handler: Player left the room.
   */
  public playerLeft(id: string): void {
    this.players.delete(id);
  }

  /**
   * Incoming packet handler: Player moved.
   */
  public playerMoved(id: string, x: number, y: number, frame: number): void {
    const player = this.players.get(id);
    if (player) {
      player.updatePosition(x, y, frame);
    }
  }

  /**
   * Incoming packet handler: Room changed.
   */
  public setRoom(roomName: string): void {
    this.currentRoom = roomName;
    this.players.clear();
  }

  /**
   * Get current room.
   */
  public getCurrentRoom(): string | null {
    return this.currentRoom;
  }

  /**
   * Get all players.
   */
  public getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }
}
