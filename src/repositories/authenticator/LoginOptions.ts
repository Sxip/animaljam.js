import { Proxy } from '../../utils/proxy'

export interface LoginOptions {
  /**
   * The screen name to use.
   */
  screen_name: string

  /**
   * The password to use.
   */
  password: string

  /**
   * Domain
   */
  domain?: 'flash' | 'mobile'

  /**
   * Proxy
   */
  proxy?: Proxy
}