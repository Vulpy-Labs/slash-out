import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("int16") x: number = 0; // int16 is more efficient than "number" (float64)
  @type("int16") y: number = 0; // Saves bandwidth and processing
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
