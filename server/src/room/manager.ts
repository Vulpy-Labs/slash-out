import { Client, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { PLAYER_ACTIONS } from 'shared/config/events/player/actions';
import { GAME, PHYSICS, CHARACTER } from 'shared/config/constants';
import { Engine, World, Body } from 'matter-js';

import { MapPhysicsManager } from '@/physics/managers/map/MapPhysicsManager';
import { PlayerPhysicsManager } from '@/physics/managers/player/PlayerPhysicsManager';

export class RoomManager extends Room {
  // Matter.js physics
  private engine: Engine;
  private world: World;

  // Map players to their Matter.js bodies
  private playerPhysicBodies: Map<string, Body> = new Map();

  // Platform bodies
  private platformBodies: Body[] = [];

  // Fixed timestep accumulator
  private accumulator: number = 0;

  private mapPhysicsManager: MapPhysicsManager;
  private playerPhysicsManager: PlayerPhysicsManager;

  onCreate() {
    console.log('Trying to initiate room connection with client');
    // Todo: () => Extract each section to functions;

    const state = new State();
    this.setState(state);
    this.setPatchRate(2);

    // Initialize Matter.js
    this.initiatePhysicsWorld();

    // Load platforms from Tiled map
    this.mapPhysicsManager = new MapPhysicsManager();
    this.mapPhysicsManager.loadPlatforms();
    this.platformBodies = this.mapPhysicsManager.getPlatformBodies();

    // Start physics simulation
    this.setSimulationInterval(deltaTime => this.update(deltaTime));

    this.playerPhysicsManager = new PlayerPhysicsManager(
      this.world,
      this.state,
      this.platformBodies
    );

    // Setup message handlers
    this.setupClientMessagesListeners();
  }

  initiatePhysicsWorld() {
    this.engine = Engine.create({
      gravity: { x: 0, y: PHYSICS.GRAVITY },
    });
    this.world = this.engine.world;
  }

  onJoin(client: Client) {
    this.playerPhysicBodies = this.playerPhysicsManager.createPlayer({
      sessionId: client.sessionId,
    });
  }

  onLeave(client: Client) {
    this.playerPhysicsManager.removePlayer(client);
  }

  update(deltaTime: number) {
    // Accumulate time since last frame
    this.accumulator += deltaTime;

    // Run physics in fixed timesteps (e.g., 16.67ms for 60fps)
    // Purpose: Fixed timestep physics (prevents physics from running faster/slower based on framerate)
    while (this.accumulator >= GAME.CONFIG.FIXED_TIME_STEP) {
      this.fixedUpdate();
      this.accumulator -= GAME.CONFIG.FIXED_TIME_STEP;
    }
  }

  fixedUpdate() {
    // Step Matter.js physics
    Engine.update(this.engine, GAME.CONFIG.FIXED_TIME_STEP);

    this.playerPhysicsManager.updatePlayersActions();
  }

  setupClientMessagesListeners() {
    this.onMessage(PLAYER_ACTIONS.MOVED, (client, payload) => {
      this.playerPhysicsManager.updatePlayerBody(client, payload);
    });
  }
}
