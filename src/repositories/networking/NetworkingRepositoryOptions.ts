import { Proxy } from '../../utils/proxy'

export interface NetworkingRepositoryOptions {
  host: string
  port: number

  auth_token: string
  screen_name: string
  deploy_version: string
  domain?: 'flash' | 'mobile'

  proxy?: Proxy
}