import { WildworksRepository } from "..";

export class Connection {
  private isConnected: boolean = false;
  private latency: number = 0;
  private roomId: string = "-1";

  // Future use: send heartbeat, track connection state, etc.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private readonly wildworks: WildworksRepository) {}

  /**
   * Incoming packet handler: Connection established.
   */
  public setConnected(connected: boolean): void {
    this.isConnected = connected;
  }

  /**
   * Incoming packet handler: Update latency.
   */
  public updateLatency(latency: number): void {
    this.latency = latency;
  }

  /**
   * Incoming packet handler: Set room ID.
   */
  public setRoomId(roomId: string): void {
    this.roomId = roomId;
  }

  /**
   * Get connection status.
   */
  public isOnline(): boolean {
    return this.isConnected;
  }

  /**
   * Get current latency.
   */
  public getLatency(): number {
    return this.latency;
  }

  /**
   * Get current room ID.
   */
  public getRoomId(): string {
    return this.roomId;
  }
}
