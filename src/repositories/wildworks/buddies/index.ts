import { WildworksRepository } from "..";
import { Me } from "../me";

export interface PlayerSearchResult {
  username: string;
  uuid: string;
  buddyStatus: number;
  animalId: number;
  level: number;
  appearance: string;
}

/**
 * Buddy management API.
 */
export class Buddies {
  constructor(
    private readonly wildworks: WildworksRepository,
    private readonly me: Me,
  ) {}

  /**
   * Get all buddies.
   */
  public getAll(): string[] {
    return this.me.getBuddies();
  }

  /**
   * Search for ANY player globally by username (not limited to buddy list).
   * Uses the 'ag' packet to search for any player in the game.
   * Returns player info including UUID, buddy status, etc.
   */
  public async searchGlobal(
    username: string,
  ): Promise<PlayerSearchResult | null> {
    this.wildworks.sendXTMessage(["ag", username, "1"]);

    try {
      const message = await this.wildworks.waitForMessage<any>(
        (msg: any) =>
          msg.type === "ag" && msg.message && msg.message[4] === username,
        { timeout: 5000 },
      );

      const uuid = message.message[5];
      if (!uuid || uuid === "") {
        return null;
      }

      return {
        username: message.message[4],
        uuid: uuid,
        buddyStatus: parseInt(message.message[6] || "0"),
        animalId: parseInt(message.message[10] || "0"),
        level: parseInt(message.message[11] || "0"),
        appearance: message.message[18] || "",
      };
    } catch {
      return null;
    }
  }

  /**
   * Search local buddy list only.
   */
  public findInBuddyList(username: string): string | null {
    const buddies = this.me.getBuddies();
    const found = buddies.find(
      (buddy) => buddy.toLowerCase() === username.toLowerCase(),
    );
    return found || null;
  }

  /**
   * Check if a user is a buddy.
   */
  public isBuddy(username: string): boolean {
    return this.me.isBuddy(username);
  }

  /**
   * Add a buddy by username.
   */
  public async addByUsername(username: string): Promise<void> {
    await this.wildworks.sendXTMessage(["ba", username]);
  }

  /**
   * Remove a buddy by username.
   */
  public async removeByUsername(username: string): Promise<void> {
    await this.wildworks.sendXTMessage(["br", username]);
  }

  /**
   * Accept a buddy request.
   */
  public async acceptRequest(username: string): Promise<void> {
    await this.wildworks.sendXTMessage(["br", username, "1"]);
  }

  /**
   * Decline a buddy request.
   */
  public async declineRequest(username: string): Promise<void> {
    await this.wildworks.sendXTMessage(["br", username, "0"]);
  }

  /**
   * Get trade list for a player.
   */
  public async getTradeList(username: string): Promise<number[]> {
    this.wildworks.sendXTMessage(["tl", username]);

    try {
      const message = await this.wildworks.waitForMessage<any>(
        (msg: any) =>
          msg.type === "tl" && msg.message && msg.message[4] === username,
        { timeout: 5000 },
      );

      const items: number[] = [];
      for (let i = 5; i < message.message.length; i++) {
        const itemId = parseInt(message.message[i]);
        if (!isNaN(itemId) && itemId > 0) {
          items.push(itemId);
        }
      }

      return items;
    } catch {
      return [];
    }
  }

  /**
   * Get player profile.
   */
  public async getProfile(username: string): Promise<void> {
    await this.wildworks.sendXTMessage(["dp", "1", username]);
  }

  /**
   * Get player item list.
   */
  public async getItemList(
    username: string,
    animalId: number = 70,
  ): Promise<void> {
    await this.wildworks.sendXTMessage([
      "il",
      username,
      animalId.toString(),
      "0",
    ]);
  }

  /**
   * Get buddy info.
   */
  public async getBuddyInfo(username: string): Promise<void> {
    await this.wildworks.sendXTMessage(["bi", username]);
  }
}
