import { Bodies, Body } from 'matter-js';
import { logger } from 'colyseus';
import * as fs from 'fs';
import * as path from 'path';
import { PhysicsUtils } from '@/utils/PhysicsUtils';
import { WorldPhysicsManager } from '@/physics/world/WorldPhysicsManager';

export class MapPhysicsManager {
  private platformBodies: Body[] = [];
  private physicsWorld: WorldPhysicsManager;

  constructor(physicsWorld: WorldPhysicsManager) {
    this.physicsWorld = physicsWorld;
  }

  loadPlatforms(): Body[] {
    try {
      const mapPath = path.join(__dirname, '../../../../shared/assets/maps/canyon.json');
      const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
      const platforms = this.extractPlatformsFromTiled(mapData);

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

      return this.platformBodies;
    } catch (error) {
      logger.error('❌ Failed to load platforms:', error);
      return [];
    }
  }

  getPlatformBodies(): Body[] {
    return this.platformBodies;
  }

  private extractPlatformsFromTiled(mapData: any): Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> {
    const platforms: Array<{ x: number; y: number; width: number; height: number }> = [];
    const tileWidth = mapData.tilewidth;
    const tileHeight = mapData.tileheight;
    const groundGroup = mapData.layers.find((layer: any) => layer.name === 'ground');

    if (!groundGroup || !groundGroup.layers) {
      logger.error('Ground group not found in Tiled map');
      return platforms;
    }

    const platformLayer = groundGroup.layers.find((layer: any) => layer.name === 'platform');

    if (!platformLayer) {
      logger.error('Platform layer not found in ground group');
      return platforms;
    }

    const data = platformLayer.data;
    const width = platformLayer.width;

    for (let i = 0; i < data.length; i++) {
      const tileGid = data[i];

      if (tileGid === 0) continue;

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
      localId: gid - firstGid,
    };
  }

  private tileHasCollider(tileset: any, localId: number): boolean {
    if (!tileset.tiles) return false;
    const tile = tileset.tiles.find((t: any) => t.id === localId);

    if (!tile || !tile.properties) return false;
    const colliderProp = tile.properties.find((p: any) => p.name === 'collider');

    return colliderProp && colliderProp.value === true;
  }
}
