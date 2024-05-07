import { PacketHandleOptions } from './PacketHandleOptions';

export const handlers: Array<PacketHandleOptions> = [];

/**
 * Indicates that the decorated method should be called when it's packet type is received by a client.
 */
export function PacketHandler (options: PacketHandleOptions): MethodDecorator {
  return (target, key) => {
    
  }
}