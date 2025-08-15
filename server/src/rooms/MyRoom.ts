import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;
  state = new MyRoomState();

  // PERFORMANCE: Pre-computed spawn positions to eliminate Math.random() calls
  private readonly spawnPositions = [
    { x: 150, y: 100 },
    { x: 250, y: 100 },
    { x: 350, y: 100 },
    { x: 450, y: 100 },
  ];
  private spawnIndex = 0;

  onCreate(options: any) {
    // ULTRA-PERFORMANCE: No simulation interval - purely event-driven for maximum efficiency
    // This eliminates 120 unnecessary function calls per second when nothing is happening

    // NETWORK OPTIMIZATION: Reduce patch frequency for better performance
    this.setPatchRate(1000 / 60); // 60fps max patch rate (was unlimited)

    this.onMessage("updatePosition", (client, message) => {
      // FASTEST POSSIBLE: Direct assignment with minimal validation
      const player = this.state.players.get(client.sessionId);
      if (player && message.x !== undefined && message.y !== undefined) {
        // Only update if position actually changed to reduce network traffic
        if (player.x !== message.x || player.y !== message.y) {
          player.x = message.x;
          player.y = message.y;
        }
      }
    });

    // NETWORK MONITORING: Ultra-fast ping/pong for latency tracking
    this.onMessage("ping", (client, message) => {
      client.send("pong", message);
    });

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    // ULTRA-FAST: No console.log, pre-computed positions, direct assignment
    const player = new Player();

    // Use pre-computed spawn positions for consistent performance
    const spawnPos =
      this.spawnPositions[this.spawnIndex % this.spawnPositions.length];
    player.x = spawnPos.x;
    player.y = spawnPos.y;
    this.spawnIndex++;

    // Direct state assignment - fastest possible
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    // PERFORMANCE: No console.log for production speed
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    // PERFORMANCE: No console.log for production speed
  }
}
