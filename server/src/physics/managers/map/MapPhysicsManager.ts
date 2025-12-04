import * as fs from 'fs';
import * as path from 'path';
import { logger } from 'colyseus';
import { Bodies, Body } from 'matter-js';

import { getCenterPositionFromTopLeft } from '@/physics/utils/getCenterPositionFromTopLeft';

export class MapPhysicsManager {
  private platformBodies: Body[] = [];

  loadPlatforms() {
    try {
      const mapPath = path.join(__dirname, '../../../../../shared/assets/maps/canyon.json');
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

        // World.add(this.world, physicalBody);
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

        const { centerX, centerY } = getCenterPositionFromTopLeft({
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

  getPlatformBodies() {
    return this.platformBodies;
  }
}
