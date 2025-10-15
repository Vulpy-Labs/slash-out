// server/src/physics/TiledMapLoader.ts
import { Platform } from './Platform.type';

export interface TiledLayer {
  name: string;
  type: string;
  width?: number;
  height?: number;
  data?: number[];
  objects?: any[];
  layers?: TiledLayer[]; // ← Add this for nested layers
}

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
}

export class TiledMapLoader {
  /**
   * Extract platforms from Tiled map JSON
   */
  static extractPlatforms(mapData: TiledMap): Platform[] {
    const platforms: Platform[] = [];
    const tileWidth = mapData.tilewidth;
    const tileHeight = mapData.tileheight;

    // Recursively find all tile layers
    const allLayers = this.flattenLayers(mapData.layers);

    // ONLY include layers with "platform" or "ground" in name
    // EXCLUDE anything with "background" or "foreground"
    const platformLayers = allLayers.filter(
      layer =>
        layer.type === 'tilelayer' &&
        (layer.name.toLowerCase().includes('platform') ||
          layer.name.toLowerCase().includes('ground')) &&
        !layer.name.toLowerCase().includes('background') &&
        !layer.name.toLowerCase().includes('foreground')
    );

    console.log(
      `Found ${platformLayers.length} platform layers:`,
      platformLayers.map(l => l.name)
    );

    for (const layer of platformLayers) {
      if (layer.data) {
        const layerPlatforms = this.parseTileLayer(layer, tileWidth, tileHeight);
        console.log(`  Layer "${layer.name}": ${layerPlatforms.length} platforms`);
        platforms.push(...layerPlatforms);
      }
    }

    return platforms;
  }

  /**
   * Recursively flatten layer groups into a single array
   */
  private static flattenLayers(layers: TiledLayer[]): TiledLayer[] {
    const flattened: TiledLayer[] = [];

    for (const layer of layers) {
      if (layer.type === 'group' && layer.layers) {
        // Recursively flatten nested groups
        flattened.push(...this.flattenLayers(layer.layers));
      } else {
        // Add non-group layers
        flattened.push(layer);
      }
    }

    return flattened;
  }

  /**
   * Parse a tile layer (grid-based)
   */
  private static parseTileLayer(
    layer: TiledLayer,
    tileWidth: number,
    tileHeight: number
  ): Platform[] {
    const platforms: Platform[] = [];
    const width = layer.width!;
    const data = layer.data!;

    for (let i = 0; i < data.length; i++) {
      const tileId = data[i];

      // Skip empty tiles (0 = empty in Tiled)
      if (tileId === 0) continue;

      const x = (i % width) * tileWidth;
      const y = Math.floor(i / width) * tileHeight;

      // Create platform for this tile
      platforms.push({
        x,
        y,
        width: tileWidth,
        height: tileHeight,
      });
    }

    // Merge adjacent tiles into larger platforms for performance
    return this.mergePlatforms(platforms);
  }

  /**
   * Merge adjacent horizontal tiles into single platforms (optimization)
   */
  private static mergePlatforms(platforms: Platform[]): Platform[] {
    if (platforms.length === 0) return [];

    // Sort by y, then x
    platforms.sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    const merged: Platform[] = [];
    let current = { ...platforms[0] };

    for (let i = 1; i < platforms.length; i++) {
      const next = platforms[i];

      // Check if next platform is adjacent horizontally
      if (
        next.y === current.y &&
        next.height === current.height &&
        next.x === current.x + current.width
      ) {
        // Extend current platform
        current.width += next.width;
      } else {
        // Save current and start new one
        merged.push(current);
        current = { ...next };
      }
    }

    merged.push(current);
    return merged;
  }
}
