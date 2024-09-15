import { RequestInit } from 'node-fetch'

export interface AnimalJamRequestOptions extends RequestInit {
  param?: string
  rawDecompress?: boolean,
  objectMode?: boolean
  headers?: RequestInit['headers']
  includeDeployVersion?: boolean
  includeHost?: boolean,
}
