import { PacketHandleOptions } from './PacketHandleOptions';

export const handlers  = [];

/**
 * Indicates that the decorated method should be called when it's packet type is received by a client.
 */
export function MessageHandle (options: PacketHandleOptions): MethodDecorator {
  return (target, key) => {
    handlers.push({
      message: options.message,
      handler: target[key].bind(target)
    })
  }
}