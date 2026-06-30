import { WildworksRepository } from "..";
import { Player, InventoryItem } from "../player";

/**
 * Inventory management API.
 */
export class Inventory {
  constructor(
    private readonly wildworks: WildworksRepository,
    private readonly player: Player,
  ) {}

  /**
   * Get all inventory items.
   */
  public getAll(): InventoryItem[] {
    return this.player.getInventory();
  }

  /**
   * Get item by ID.
   */
  public getItemById(itemId: number): InventoryItem | undefined {
    return this.player.getInventory().find((item) => item.id === itemId);
  }

  /**
   * Check if player has item.
   */
  public hasItem(itemId: number): boolean {
    return this.player.hasItem(itemId);
  }

  /**
   * Get quantity of a specific item.
   */
  public getQuantity(itemId: number): number {
    const item = this.getItemById(itemId);
    return item?.quantity ?? 0;
  }

  /**
   * Recycle item by ID.
   */
  public async recycleById(itemId: number): Promise<void> {
    await this.wildworks.sendXTMessage(["ir", itemId.toString()]);
    const response = await this.wildworks.waitForMessageOfType("ir", {
      timeout: 5000,
    });

    const status = parseInt((response as any).message[4]);
    if (status !== 1) {
      throw new Error(
        `Recycle failed with status: ${status} (item may not be recyclable)`,
      );
    }
  }

  /**
   * Use/equip item by ID.
   */
  public async useById(itemId: number): Promise<void> {
    await this.wildworks.sendXTMessage([
      "iu",
      "1",
      "1",
      itemId.toString(),
      "0",
    ]);
    const response = await this.wildworks.waitForMessageOfType("iu", {
      timeout: 5000,
    });

    const success = parseInt((response as any).message[4]);
    if (success !== 1) {
      throw new Error(`Use/equip failed with status: ${success}`);
    }
  }
}
