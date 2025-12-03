import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { PLAYER_ACTIONS } from 'shared/config/events/player/actions';
import { GAME, PHYSICS, CHARACTER, SCENE } from 'shared/config/constants';
import { Engine, World, Bodies, Body } from 'matter-js';
import * as fs from 'fs';
import * as path from 'path';
import { PhysicsUtils } from '@/utils/PhysicsUtils';
import Matter = require('matter-js');

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

  onCreate() {
    console.log('Trying to initiate room connection with client');

    const state = new State();
    this.setState(state);
    this.setPatchRate(2);

    // Initialize Matter.js
    this.initiatePhysicsWorld();

    // Load platforms from Tiled map
    this.loadPlatforms();

    // Start physics simulation
    this.setSimulationInterval(deltaTime => this.update(deltaTime));

    // Setup message handlers
    this.setupClientMessagesListeners();
  }

  initiatePhysicsWorld() {
    this.engine = Engine.create({
      gravity: { x: 0, y: PHYSICS.GRAVITY },
    });
    this.world = this.engine.world;
  }

  loadPlatforms() {
    try {
      const mapPath = path.join(__dirname, '../../../shared/assets/maps/canyon.json');
      const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));

      const platforms = this.extractPlatformsFromTiled(mapData);

      console.log(`📦 Extracted ${platforms.length} platform tiles`);

      platforms.forEach(platform => {
        const physicalBody = Bodies.rectangle(
          platform.x,
          platform.y,
          platform.width,
          platform.height,
          {
            isStatic: true,
            label: 'platform',
            friction: 0.8,
            restitution: 0,
          }
        );

        World.add(this.world, physicalBody);
        this.platformBodies.push(physicalBody);
      });

      console.log(`✅ Created ${this.platformBodies.length} Matter.js platform bodies`);
    } catch (error) {
      console.error('❌ Failed to load platforms:', error);
    }
  }

  extractPlatformsFromTiled(mapData: any) {
    const platforms: Array<{ x: number; y: number; width: number; height: number }> = [];
    const tileWidth = mapData.tilewidth; // 16
    const tileHeight = mapData.tileheight; // 16

    // Your map has nested layer groups
    // We need to find the "ground" group, then the "platform" layer inside it
    const groundGroup = mapData.layers.find((layer: any) => layer.name === 'ground');

    if (!groundGroup || !groundGroup.layers) {
      logger.error('Ground group not found in Tiled map');
      return platforms;
    }

    // Find the platform layer inside the ground group
    const platformLayer = groundGroup.layers.find((layer: any) => layer.name === 'platform');

    if (!platformLayer) {
      logger.error('Platform layer not found in ground group');
      return platforms;
    }

    // Extract tiles marked with "collider" property
    // Your tiles have the "collider: true" property set
    const data = platformLayer.data;
    const width = platformLayer.width; // 22

    for (let i = 0; i < data.length; i++) {
      const tileGid = data[i];

      if (tileGid === 0) continue; // Empty tile

      // Check if this tile has the collider property
      // We need to find which tileset this tile belongs to
      const tilesetInfo = this.getTilesetForGid(mapData, tileGid);

      if (tilesetInfo && this.tileHasCollider(tilesetInfo.tileset, tilesetInfo.localId)) {
        const left = (i % width) * tileWidth;
        const top = Math.floor(i / width) * tileHeight;

        const { centerX, centerY } = PhysicsUtils.getCenterPositionFromTopLeft({
          x: left,
          y: top,
          width: tileWidth,
          height: tileHeight,
        });

        platforms.push({
          x: centerX,
          y: centerY,
          width: tileWidth,
          height: tileHeight,
        });
      }
    }

    logger.info(`Extracted ${platforms.length} platform tiles from Tiled map`);
    return platforms;
  }

  getTilesetForGid(mapData: any, gid: number) {
    // Find which tileset this GID belongs to
    let tileset = null;
    let firstGid = 0;

    for (const ts of mapData.tilesets) {
      if (gid >= ts.firstgid) {
        tileset = ts;
        firstGid = ts.firstgid;
      }
    }

    if (!tileset) return null;

    return {
      tileset,
      localId: gid - firstGid, // Convert global ID to local tile ID
    };
  }

  tileHasCollider(tileset: any, localId: number): boolean {
    if (!tileset.tiles) return false;

    // Find the tile definition
    const tile = tileset.tiles.find((t: any) => t.id === localId);

    if (!tile || !tile.properties) return false;

    // Check if it has collider property set to true
    const colliderProp = tile.properties.find((p: any) => p.name === 'collider');

    return colliderProp && colliderProp.value === true;
  }

  onJoin(client: Client) {
    logger.info('Player joined:', client.sessionId);

    try {
      this.createPlayer({ sessionId: client.sessionId });
    } catch (error) {
      logger.error('Error in onJoin:', error);
    }
  }

  onLeave(client: Client) {
    logger.warn(client.sessionId, 'left!');

    // Remove Matter.js physicalBody
    const physicalBody = this.playerPhysicBodies.get(client.sessionId);
    if (physicalBody) {
      World.remove(this.world, physicalBody);
      this.playerPhysicBodies.delete(client.sessionId);
    }

    // Remove from state
    this.state.players.delete(client.sessionId);
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

    // Sync Matter.js bodies → Colyseus state
    this.state.players.forEach((playerState: Player, sessionId: string) => {
      const playerBody = this.playerPhysicBodies.get(sessionId);
      if (!playerBody) return;

      // Clamp velocities
      if (Math.abs(playerBody.velocity.x) > CHARACTER.MOVEMENT.GROUND.SPEED) {
        Body.setVelocity(playerBody, {
          x: Math.sign(playerBody.velocity.x) * CHARACTER.MOVEMENT.GROUND.SPEED,
          y: playerBody.velocity.y,
        });
      }

      if (Math.abs(playerBody.velocity.y) > CHARACTER.MOVEMENT.AIR.SPEED) {
        Body.setVelocity(playerBody, {
          x: playerBody.velocity.x,
          y: Math.sign(playerBody.velocity.y) * CHARACTER.MOVEMENT.AIR.SPEED,
        });
      }

      // Check if grounded (simple check - you can improve this)
      playerState.isGrounded = this.isBodyGrounded(playerBody);
      // Update player state from Matter.js physicalBody (convert from center to top-left)
      this.syncPlayerStateWithPlayerBody({ playerState, playerBody });
    });
  }

  createPlayer({ sessionId }: { sessionId: string }) {
    const mapWidth = SCENE.WIDTH;
    const playerId = sessionId;
    try {
      // Create Colyseus player state
      const player = new Player();
      player.x = Math.random() * (mapWidth - CHARACTER.CONFIG.WIDTH);
      player.y = 100; // Spawn in air

      console.log(`👤 Player spawned at: x=${player.x}, y=${player.y}`);

      this.state.players.set(playerId, player);

      const playerBody = Bodies.rectangle(
        player.x,
        player.y,
        CHARACTER.CONFIG.WIDTH,
        CHARACTER.CONFIG.HEIGHT,
        {
          label: 'player',
          friction: CHARACTER.MOVEMENT.GROUND.FRICTION,
          frictionAir: CHARACTER.MOVEMENT.AIR.FRICTION,
          restitution: 0,
          inertia: Infinity, // Prevent rotation
        }
      );
      console.log(
        `👤 Player playerBody created at: x=${playerBody.position.x}, y=${playerBody.position.y}`
      );

      World.add(this.world, playerBody);
      this.playerPhysicBodies.set(playerId, playerBody);

      logger.info(`Player ${playerId} added with Matter.js physicalBody`);
    } catch (error: any) {
      logger.error(`Player ${playerId} not created. Error:`, error.message);
    }
  }

  syncPlayerStateWithPlayerBody({
    playerState,
    playerBody,
  }: {
    playerState: Player;
    playerBody: Matter.Body;
  }) {
    playerState.x = playerBody.position.x;
    playerState.y = playerBody.position.y;
    playerState.velocityX = playerBody.velocity.x;
    playerState.velocityY = playerBody.velocity.y;
  }

  isBodyGrounded(physicalBody: Body): boolean {
    const groundThresholdPixels = 2;

    for (const platform of this.platformBodies) {
      const bodyBottom = physicalBody.position.y + CHARACTER.CONFIG.HEIGHT / 2;
      const platformTop = platform.bounds.min.y;

      if (
        Math.abs(bodyBottom - platformTop) < groundThresholdPixels &&
        physicalBody.position.x + CHARACTER.CONFIG.WIDTH / 2 > platform.bounds.min.x &&
        physicalBody.position.x - CHARACTER.CONFIG.WIDTH / 2 < platform.bounds.max.x
      ) {
        return true;
      }
    }

    return false;
  }

  setupClientMessagesListeners() {
    this.onMessage(PLAYER_ACTIONS.MOVED, (client, payload) => {
      const playerBody = this.playerPhysicBodies.get(client.sessionId);
      const playerState = this.state.players.get(client.sessionId);

      if (!playerBody || !playerState) return;

      // Handle horizontal movement
      if (payload.left) {
        Body.setVelocity(playerBody, {
          x: -CHARACTER.MOVEMENT.GROUND.SPEED,
          y: playerBody.velocity.y,
        });
      } else if (payload.right) {
        Body.setVelocity(playerBody, {
          x: CHARACTER.MOVEMENT.GROUND.SPEED,
          y: playerBody.velocity.y,
        });
      } else {
        // ✅ Stop horizontal movement
        Body.setVelocity(playerBody, {
          x: 0,
          y: playerBody.velocity.y,
        });
      }

      // Handle jump (independent)
      if (payload.jump && playerState.isGrounded) {
        Body.setVelocity(playerBody, {
          x: playerBody.velocity.x,
          y: -CHARACTER.MOVEMENT.AIR.SPEED,
        });

        playerState.isGrounded = false; // Immediately set false to prevent double jump
      }
    });
  }
}
