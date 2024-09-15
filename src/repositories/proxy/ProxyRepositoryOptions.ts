export interface ProxyRepositoryOptions {
  concurrency?: number
  proxies: Proxy[]
  timeout?: number
}

export interface Proxy {
  type: 'http' | 'socks5'
  host: string
  port: number
}

export interface ProxyRepositoryResponse {
  proxy: Proxy
  isWorking: boolean
}