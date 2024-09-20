import { NetworkingRepository } from '..'
import { PacketHandleOptions } from './PacketHandleOptions'

export const handlers: Handler<any>[] = []

interface Handler<T> {
  message: string
  handler: (message: T, networking: NetworkingRepository) => any
}

/**
 * Indicates that the decorated method should be called when its packet type is received by a client.
 * @param options Options that define the packet message and other handler settings.
 */
export function IncomingMessageHandler<T>(options: PacketHandleOptions): MethodDecorator {
  return (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
    if (typeof descriptor.value !== 'function') throw new Error('IncomingMessageHandler can only be applied to methods.')
    const originalMethod = descriptor.value as (packet: T) => any

    handlers.push({
      message: options.message,
      handler: originalMethod.bind(new (target as any).constructor())
    })
  }
}