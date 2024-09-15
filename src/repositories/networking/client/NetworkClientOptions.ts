import { ProxyOptions } from "../../../request/AnimalJamRequestOptions"

export interface NetworkClientOptions {
  host: string
  port: number

  proxy? : ProxyOptions
}