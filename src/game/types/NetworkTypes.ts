// Client-side types for Colyseus schema
export interface Player {
  x: number;
  y: number;
}

export interface RoomState {
  players: Map<string, Player>;
}
