export interface AnimalJamResponse {
  status: number
  statusText: string
  headers: Response['headers']
  data?: unknown
}
