import { Bodies, Body } from 'matter-js';
import { logger } from 'colyseus';
import * as fs from 'fs';
import * as path from 'path';
import { PhysicsUtils } from '@/utils/PhysicsUtils';
import { PhysicsWorldManager } from '../physics/PhysicsWorldManager';

/**
 * Manages map loading and platform creation from Tiled map files.
 * Responsible for parsing Tiled JSON, extracting platform data, and creating physics bodies.
 */
export class MapManager {
  private platformBodies: Body[] = [];
  private physicsWorld: PhysicsWorldManager;

  constructor(physicsWorld: PhysicsWorldManager) {
    this.physicsWorld = physicsWorld;
  }

  /**
   * Load platforms from a Tiled map file and create physics bodies.
   */
  loadPlatforms(): Body[] {
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
            friction: 0,
            restitution: 0,
          }
        );

        this.physicsWorld.addBody(physicalBody);
        this.platformBodies.push(physicalBody);
      });

      console.log(`✅ Created ${this.platformBodies.length} Matter.js platform bodies`);

      return this.platformBodies;
    } catch (error) {
      console.error('❌ Failed to load platforms:', error);
      return [];
    }
  }

  /**
   * Get all platform bodies.
   */
  getPlatformBodies(): Body[] {
    return this.platformBodies;
  }

  /**
   * Extract platform data from Tiled map JSON.
   */
  private extractPlatformsFromTiled(mapData: any): Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> {
    const platforms: Array<{ x: number; y: number; width: number; height: number }> = [];
    const tileWidth = mapData.tilewidth; // 16
    const tileHeight = mapData.tileheight; // 16

    // Find the "ground" group
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
    const data = platformLayer.data;
    const width = platformLayer.width; // 22

    for (let i = 0; i < data.length; i++) {
      const tileGid = data[i];

      if (tileGid === 0) continue; // Empty tile

      // Check if this tile has the collider property
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

  /**
   * Find which tileset a GID belongs to and return local tile ID.
   */
  private getTilesetForGid(mapData: any, gid: number): { tileset: any; localId: number } | null {
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

  /**
   * Check if a tile has the collider property set to true.
   */
  private tileHasCollider(tileset: any, localId: number): boolean {
    if (!tileset.tiles) return false;

    // Find the tile definition
    const tile = tileset.tiles.find((t: any) => t.id === localId);

    if (!tile || !tile.properties) return false;

    // Check if it has collider property set to true
    const colliderProp = tile.properties.find((p: any) => p.name === 'collider');

    return colliderProp && colliderProp.value === true;
  }
}
