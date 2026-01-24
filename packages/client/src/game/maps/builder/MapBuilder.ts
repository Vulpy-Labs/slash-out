import { DEPTH } from '@/config/constants';
import { TiledComponent } from '@/ecs/components';
import {
  DepthMapping,
  MapBuilderProp,
  SetLayerDepthProp,
  CreateMapLayerProp,
  MapCustomProperties,
} from './types.p';

class MapBuilder {
  private map: Phaser.Tilemaps.Tilemap;
  private customProps: MapCustomProperties;
  private tilesets: Phaser.Tilemaps.Tileset[];

  private mapName: string;
  private scene: Phaser.Scene;

  private baseMapPath = 'assets/maps';
  private baseSpritesPath = 'assets/sprites/map';

  constructor({ scene, mapName }: MapBuilderProp) {
    this.scene = scene;
    this.mapName = mapName;
  }

  load() {
    this.loadTiledMap();
    this.loadSprites();
  }

  build() {
    this.createMap();
    this.createWorldLayers();

    this.customProps = this.getCustomProperties();

    return { map: this.map, props: this.customProps };
  }

  private loadTiledMap() {
    const mapPath = `${this.baseMapPath}/${this.mapName}.json`;
    this.scene.load.tilemapTiledJSON(this.mapName, mapPath);
  }

  private loadSprites() {
    this.scene.load.once(
      Phaser.Loader.Events.FILE_COMPLETE,
      (_: string, __: string, data: TiledComponent) => {
        const tilesets = data.tilesets || [];

        tilesets.forEach(tileset => {
          const image = tileset.name;

          if (this.scene.textures.exists(image)) return;

          this.scene.load.image(image, `${this.baseSpritesPath}/${image}.png`);
        });
      }
    );
  }

  private createMap() {
    this.map = this.scene.make.tilemap({ key: this.mapName });

    this.tilesets = this.map.tilesets
      .map(t => this.map.addTilesetImage(t.name, t.name))
      .filter(tileset => !!tileset);
  }

  private createMapLayer({ layerGroup, tilesets }: CreateMapLayerProp) {
    return this.map.layers
      .filter(layer => layer.name.startsWith(`${layerGroup}/`))
      .map(layer => {
        const createdLayer = this.map.createLayer(layer.name, tilesets, 0, 0);

        if (createdLayer) this.setLayerDepth({ layerGroup, layer: createdLayer });

        return createdLayer;
      })
      .filter(layer => !!layer);
  }

  private createWorldLayers() {
    this.createMapLayer({ layerGroup: 'background', tilesets: this.tilesets });
    this.createMapLayer({ layerGroup: 'ground', tilesets: this.tilesets });
    this.createMapLayer({ layerGroup: 'foreground', tilesets: this.tilesets });
  }

  private setLayerDepth({ layerGroup, layer }: SetLayerDepthProp) {
    const depthMapping: DepthMapping = {
      ground: DEPTH.GROUND,
      background: DEPTH.BACKGROUND,
      foreground: DEPTH.FOREGROUND,
    };

    const depth = depthMapping[layerGroup];

    if (depth === undefined) {
      console.warn(`The "${layerGroup}" layer group does not have a configured depth.`);
      return;
    }

    layer.setDepth(depth);
  }

  private getCustomProperties() {
    const mapProps = this.map.properties;
    const customProps: MapCustomProperties = {};

    if (!Array.isArray(mapProps)) return customProps;

    mapProps.forEach(prop => (customProps[prop.name] = prop.value));

    return customProps;
  }
}

export { MapBuilder };
