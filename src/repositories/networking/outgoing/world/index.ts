export class WorldMessage {
  static readonly message = Array<string>(
    'xt',
    'o',
    'rj',
    '-1',
    'jamaa_township.room_main#-1',
    '1',
    '0',
    '0',
  )

  public static build (): string {
    return `%${WorldMessage.message.join('%')}%`
  }
}