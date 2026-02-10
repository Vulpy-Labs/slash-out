type MapBuilderProp = {
  scene: Phaser.Scene;
  mapName: string;
};

type CreateMapLayerProp = {
  layerGroup: string;
  tilesets: Phaser.Tilemaps.Tileset[];
};

type SetLayerDepthProp = {
  layerGroup: string;
  layer: Phaser.Tilemaps.TilemapLayer;
};

type DepthMapping = Record<string, number>;

type MapSpawnPoint = { x: number; y: number };

type MapCustomProperties = Record<string, string | number | boolean | undefined>;

export type {
  MapBuilderProp,
  SetLayerDepthProp,
  CreateMapLayerProp,
  MapCustomProperties,
  MapSpawnPoint,
  DepthMapping,
};
