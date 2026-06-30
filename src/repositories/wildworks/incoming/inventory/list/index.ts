import { WildworksRepository } from "../../..";
import { IncomingMessageHandler } from "../../../decorators/PacketHandler";
import { XTMessage } from "../../../messages/XTMessage";
import { InventoryItem } from "../../../player";

export class InventoryListMessage {
  /**
   * Handles inventory list packet.
   * @param param The packet to handle.
   */
  @IncomingMessageHandler<XTMessage>({
    message: "il",
  })
  public handle({ message }: XTMessage, wildworks: WildworksRepository): void {
    const type = parseInt(message[4]);
    const playerId = message[6];
    const username = message[7];

    const isMe =
      type === 0 ||
      playerId === wildworks.me.getPlayerId() ||
      username === wildworks.me.getUsername();

    if (type === 2) {
      const itemId = parseInt(message[10]);
      if (isMe) {
        wildworks.me.removeItem(itemId, 1);
      } else {
        const player = wildworks.context.map.getOrCreatePlayer(
          playerId,
          username,
        );
        player.removeItem(itemId, 1);
      }
      return;
    }

    if (type === 3) {
      const itemId = parseInt(message[10]);
      if (isMe) {
        wildworks.me.addItem(itemId, 1);
      } else {
        const player = wildworks.context.map.getOrCreatePlayer(
          playerId,
          username,
        );
        player.addItem(itemId, 1);
      }
      return;
    }

    const fieldsPerItem = parseInt(message[9] || "3");
    const items: InventoryItem[] = [];

    for (let i = 11; i < message.length; i += fieldsPerItem) {
      const itemId = parseInt(message[i]);

      if (!isNaN(itemId) && itemId > 0) {
        const item: InventoryItem = {
          id: itemId,
          quantity: 1,
        };

        if (fieldsPerItem >= 3) {
          const layerId = parseInt(message[i + 1]);
          const color = parseInt(message[i + 2]);

          if (!isNaN(layerId)) item.layerId = layerId;
          if (!isNaN(color)) item.color = color;
        }

        items.push(item);
      }
    }

    if (isMe) {
      wildworks.me.updateInventory(items);
    } else {
      const player = wildworks.context.map.getOrCreatePlayer(
        playerId,
        username,
      );
      player.updateInventory(items);
    }
  }
}
