import { PacketHandleOptions } from './PacketHandleOptions';

export const handlers  = [];

/**
 * Indicates that the decorated method should be called when it's packet type is received by a client.
 */
export function IncomingMessageHandler (options: PacketHandleOptions): MethodDecorator {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    handlers.push({
      message: options.message,
      handler: target[key].bind(new target.constructor())
    })
  }
}