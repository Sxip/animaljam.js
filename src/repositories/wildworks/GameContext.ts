import { Me } from "./me";
import { GameMap } from "./map";
import { Connection } from "./connection";
import { Buddies } from "./buddies";

export interface WildWorksGameContext {
  me: Me;
  map: GameMap;
  connection: Connection;
  buddies: Buddies;
}
