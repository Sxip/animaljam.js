import { Response } from 'node-fetch'

export interface AnimalJamResponse<Data> {
  status: number
  statusText: string
  headers: Response['headers']
  data?: Data
}
