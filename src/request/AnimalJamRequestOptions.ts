export interface AnimalJamRequestOptions extends RequestInit {
  param?: string
  rawDecompress?: boolean,
  objectMode?: boolean
  includeDeployVersion?: boolean
  includeHost?: boolean
}
