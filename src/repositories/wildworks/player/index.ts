import { WildworksRepository } from "..";

export interface InventoryItem {
  id: number;
  quantity: number;
  layerId?: number;
  color?: number;
}

/**
 * Represents any player in the game (including yourself).
 */
export class Player {
  public id: string;
  public username: string;
  public x: number = 0;
  public y: number = 0;
  public frame: number = 0;
  public session?: string;
  public uuid?: string;
  public gems?: number;
  public diamonds?: number;
  public tickets?: number;

  protected _inventory: Map<number, InventoryItem> = new Map();
  protected _buddies: string[] = [];

  public constructor(
    protected readonly wildworks: WildworksRepository,
    id: string,
    username: string,
  ) {
    this.id = id;
    this.username = username;
  }

  /**
   * Get player position.
   */
  public getPosition(): { x: number; y: number; frame: number } {
    return { x: this.x, y: this.y, frame: this.frame };
  }

  /**
   * Get player username.
   */
  public getUsername(): string {
    return this.username;
  }

  /**
   * Get player ID.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Get player UUID.
   */
  public getUuid(): string | undefined {
    return this.uuid;
  }

  /**
   * Get player session.
   */
  public getSession(): string | undefined {
    return this.session;
  }

  /**
   * Get player currencies.
   */
  public getCurrencies(): {
    gems?: number;
    diamonds?: number;
    tickets?: number;
  } {
    return {
      gems: this.gems,
      diamonds: this.diamonds,
      tickets: this.tickets,
    };
  }

  /**
   * Get player inventory.
   */
  public getInventory(): InventoryItem[] {
    return Array.from(this._inventory.values());
  }

  /**
   * Check if player has item.
   */
  public hasItem(itemId: number): boolean {
    return this._inventory.has(itemId);
  }

  /**
   * Get player buddies.
   */
  public getBuddies(): string[] {
    return [...this._buddies];
  }

  /**
   * Check if player is buddy.
   */
  public isBuddy(username: string): boolean {
    return this._buddies.includes(username);
  }

  /**
   * Update player position (called by incoming packets).
   */
  public updatePosition(x: number, y: number, frame: number): void {
    this.x = x;
    this.y = y;
    this.frame = frame;
  }

  /**
   * Update player currencies (called by incoming packets).
   */
  public updateCurrencies(currencies: {
    gems?: number;
    diamonds?: number;
    tickets?: number;
  }): void {
    if (currencies.gems !== undefined) this.gems = currencies.gems;
    if (currencies.diamonds !== undefined) this.diamonds = currencies.diamonds;
    if (currencies.tickets !== undefined) this.tickets = currencies.tickets;
  }

  /**
   * Update inventory (called by incoming packets).
   */
  public updateInventory(items: InventoryItem[]): void {
    for (const item of items) {
      this._inventory.set(item.id, item);
    }
  }

  /**
   * Add item to inventory (called by incoming packets).
   */
  public addItem(id: number, quantity: number): void {
    const existing = this._inventory.get(id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this._inventory.set(id, { id, quantity });
    }
  }

  /**
   * Remove item from inventory (called by incoming packets).
   */
  public removeItem(id: number, quantity: number): void {
    const existing = this._inventory.get(id);
    if (existing) {
      existing.quantity -= quantity;
      if (existing.quantity <= 0) {
        this._inventory.delete(id);
      }
    }
  }

  /**
   * Set buddy list (called by incoming packets).
   */
  public setBuddies(buddies: string[]): void {
    this._buddies = buddies;
  }

  /**
   * Add buddy (called by incoming packets).
   */
  public addBuddy(username: string): void {
    if (!this._buddies.includes(username)) {
      this._buddies.push(username);
    }
  }

  /**
   * Remove buddy (called by incoming packets).
   */
  public removeBuddy(username: string): void {
    const index = this._buddies.indexOf(username);
    if (index !== -1) {
      this._buddies.splice(index, 1);
    }
  }
}
