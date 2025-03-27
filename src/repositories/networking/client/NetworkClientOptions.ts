import { Proxy } from '../../../utils/proxy'

export interface NetworkClientOptions {
  host: string
  port: number
  proxy? : Proxy
  domain?: 'flash' | 'mobile'

  reconnect?: boolean
  reconnectDelay?: number
  reconnectAttempts?: number
  maxReconnectAttempts?: number
}