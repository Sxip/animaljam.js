import { PacketHandler } from "../../decorators/PacketHandler";

export class RndKPacket {
  @PacketHandler({ 
    type: 'XML' ,
    packet: 'rndK',
  })
  public async handle ({ message: CheerioAPI, networking: NetworkingRepository }): Promise<void> {
  }
}