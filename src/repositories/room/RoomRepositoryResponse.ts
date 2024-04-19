export interface RoomRepositoryResponse {
  assets: Asset[]
}

export interface Asset {
  name: string
  type: string
  data: string
}