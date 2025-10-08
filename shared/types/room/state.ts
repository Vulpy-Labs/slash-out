import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "../player"

export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
