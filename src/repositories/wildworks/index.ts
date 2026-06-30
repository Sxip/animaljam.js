import { WildworksRepositoryOptions } from "./WildworksRepositoryOptions";
import { PacketHandler } from "./PacketHandler";
import { RndKMessage } from "./outgoing/rndK";
import { WildworksClient } from "./client/WildworksClient";
import { HMAC_KEY } from "../../Constants";
import { readdir } from "node:fs/promises";
import { createHmac } from "node:crypto";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { XMLMessage } from "./messages/XMLMessage";
import { JSONMessage } from "./messages/JSONMessage";
import { XTMessage } from "./messages/XTMessage";
import { WildWorksGameContext } from "./GameContext";
import { Me } from "./me";
import { GameMap } from "./map";
import { Connection } from "./connection";
import { Buddies } from "./buddies";

export class WildworksRepository extends WildworksClient {
  /**
   * Game context containing all game state.
   */
  public readonly context: WildWorksGameContext;

  /**
   * Packet handler.
   */
  private readonly packetHandler: PacketHandler = new PacketHandler(this);

  public on(
    event: "message",
    listener: (message: XMLMessage | JSONMessage | XTMessage) => void,
  ): this;
  public on(event: "ready", listener: () => void): this;
  public on(event: "received", listener: (message: any) => any): this;
  public on(event: "error", listener: (error: Error) => any): this;
  public on(event: "close", listener: () => any): this;
  public on(event: "reconnect", listener: () => any): this;
  public on(
    event: "reconnecting",
    listener: ({ attempt, delay }: { attempt: number; delay: number }) => any,
  ): this;
  public on(event: "reconnect_failed", listener: (error: Error) => any): this;
  public on(
    event: "reconnect_error",
    listener: ({ attempt, delay }: { attempt: number; delay: number }) => any,
  ): this;

  /**
   * Any other event.
   */
  public on(event: any, listener: (...args: any[]) => void): this {
    super.on(event, listener);
    return this;
  }

  /**
   * @param options Options for the wildworks repository.
   */
  public constructor(public readonly options: WildworksRepositoryOptions) {
    super({
      host: options.host,
      port: options.port,
      proxy: options.proxy,
      domain: options.domain ?? "flash",

      reconnect: options.reconnect,
      reconnectDelay: options.reconnectDelay,
      reconnectAttempts: options.reconnectAttempts,
      maxReconnectAttempts: options.maxReconnectAttempts,
    });

    const me = new Me(this);
    this.context = {
      me: me,
      map: new GameMap(this),
      connection: new Connection(this),
      buddies: new Buddies(this, me),
    };
  }

  /**
   * Get the Me API.
   */
  public get me(): Me {
    return this.context.me;
  }

  /**
   * Get the Map API.
   */
  public get map(): GameMap {
    return this.context.map;
  }

  /**
   * Get the Connection API.
   */
  public get connection(): Connection {
    return this.context.connection;
  }

  /**
   * Get the Buddies API.
   */
  public get buddies(): Buddies {
    return this.context.buddies;
  }

  /**
   * Creates a wildworks client.
   * @param options Options for the wildworks client.
   * @returns {Promise<WildworksRepository>}
   */
  public static async createClient(
    options: WildworksRepositoryOptions,
  ): Promise<WildworksRepository> {
    if (options.domain !== "mobile")
      options.host = `lb-${options.host.replace(/\.(stage|prod)\.animaljam\.internal$/, "-$1.animaljam.com")}`;

    const wildworks = new WildworksRepository({
      host: options.host,
      port: options.port,

      auth_token: options.auth_token,
      screen_name: options.screen_name,
      deploy_version: options.deploy_version,

      domain: options.domain ?? "flash",
      proxy: options.proxy ?? undefined,

      reconnect: options.reconnect ?? false,
      reconnectDelay: options.reconnectDelay ?? 1000,
      reconnectAttempts: options.reconnectAttempts ?? 0,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 0,
    });

    await wildworks.usePacketHandlers();
    return wildworks;
  }

  /**
   * Creates a connection to the server.
   * @returns {Promise<void>}
   */
  public async connect(): Promise<void> {
    await super.connect();

    this.on("received", this.onReceivedMessage.bind(this));

    this.sendRawMessage(RndKMessage.build());
  }

  /**
   * Handles sending a raw message.
   * @param message The message to send.
   * @returns {Promise<void>}
   */
  public async sendRawMessage(message: string): Promise<number> {
    return await this.write(message);
  }

  /**
   * Sends a xt message to the server.
   * @param args The arguments for the xt message.
   * @returns {Promise<number>}
   */
  public async sendXTMessage(args: string[]): Promise<number> {
    const roomId = this.context.connection.getRoomId();
    const command = args[0];
    const params = args.slice(1);
    const message = `%xt%o%${command}%${roomId}%${params.join("%")}%`;

    return await this.sendRawMessage(message);
  }

  /**
   * Creates a hmac message for Animal Jam Play Wild.
   * @param message The message to create the hmac for.
   * @returns {string}
   */
  public createHmacMessage(message: string): string {
    if (this.options.domain !== "mobile")
      throw new Error("createHmacMessage is only supported for mobile");

    const session = this.context.me.getSession();
    const uuid = this.context.me.getUuid();

    if (!session || !uuid)
      throw new Error("session and uuid are not set, call connect() first");

    const secret = `${HMAC_KEY}${session}`;
    message = `${message}${uuid}`;

    return createHmac("sha256", secret).update(message).digest("base64");
  }

  /**
   * Loads the packet handlers.
   * @returns {Promise<void>}
   */
  public async usePacketHandlers(): Promise<void> {
    const handlers = await readdir(
      path.resolve(dirname(fileURLToPath(import.meta.url)), "./incoming"),
      {
        recursive: true,
      },
    );

    for (const handler of handlers.filter((handler) =>
      /index\.(ts|js)$/i.test(handler),
    )) {
      await import(`./incoming/${handler}`);
    }
  }

  /**
   * Waits for a message matching the predicate.
   * @param predicate Function to test each message.
   * @param timeout The timeout in milliseconds.
   * @returns {Promise<XMLMessage | JSONMessage | XTMessage>}
   */
  public async waitForMessage<T = XMLMessage | JSONMessage | XTMessage>(
    predicate: (message: XMLMessage | JSONMessage | XTMessage) => boolean,
    { timeout }: { timeout: number },
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const onMessage = (message: XMLMessage | JSONMessage | XTMessage) => {
        if (predicate(message)) {
          this.off("message", onMessage);
          resolve(message as T);
        }
      };

      this.on("message", onMessage);

      setTimeout(() => {
        this.off("message", onMessage);
        reject(new Error(`Timeout waiting for message`));
      }, timeout);
    });
  }

  /**
   * Waits for a message of the specified type.
   * @param type The type of message to wait for.
   * @param timeout The timeout in milliseconds.
   * @returns {Promise<XMLMessage | JSONMessage | XTMessage>}
   */
  public async waitForMessageOfType<T = XMLMessage | JSONMessage | XTMessage>(
    type: string,
    { timeout }: { timeout: number },
  ): Promise<T> {
    return this.waitForMessage<T>((message) => message.type === type, {
      timeout,
    });
  }

  /**
   * Handles the received message buffer.
   * @param buffer The received message buffer.
   */
  private async onReceivedMessage(buffer: Buffer): Promise<void> {
    const message = buffer.toString();

    const validMessage = this.packetHandler.validate(message);
    if (validMessage) {
      validMessage.parse();

      await this.packetHandler.handle(validMessage);
      this.emit("message", validMessage);
    }
  }

  /**
   * Closes the connection.
   */
  public async close(): Promise<void> {
    await super.close();
    this.emit("close");
  }
}
