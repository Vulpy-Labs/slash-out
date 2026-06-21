// PR - 4
import { EntityBuilder } from '../types';
import type { EntityManager } from '@/managers/entity/EntityManager';
import {
  CHARACTERS_SPRITES_MODEL,
  DEPTH,
  ENTITY_TYPES,
  PLAYER_DIMENSIONS,
} from '@/config/constants';

import {
  defaultInput,
  defaultKeymap,
  defaultMovement,
  defaultPlayerAnimation,
  defaultState,
} from '@/utils/factories/ecs/components';

import type { PlayerEntity, GlobalEntity } from '@/ecs/entities';
import type {
  PlayerBuilderProp,
  MountPlayerEntityProp,
  CreatePlayerSpriteProp,
  PlayerBuilderPayloadProp,
  LoadCharacterSpritesProp,
} from './types.p';

class PlayerBuilder implements EntityBuilder {
  private readonly manager: EntityManager;
  private readonly scene: Phaser.Scene;

  private readonly loadingSpritesKeys: Set<string> = new Set();
  private readonly baseCharacterSpritesPath = 'assets/sprites/characters';

  // ! Remove after the implementation of the respawn system
  private readonly tempSpawnPoints = {
    x: 100,
    y: 100,
  };

  constructor({ manager }: PlayerBuilderProp) {
    this.manager = manager;
    this.scene = manager.scene;
  }

  load({ character }: PlayerBuilderPayloadProp) {
    this.loadCharacterSprites({ character });
  }

  build({ character }: PlayerBuilderPayloadProp) {
    this.createPlayer({ character });
  }

  private loadCharacterSprites({ character }: PlayerBuilderPayloadProp) {
    const characterSprites = CHARACTERS_SPRITES_MODEL[character.name];

    if (!characterSprites) {
      throw new Error(`Sprite model not found for character: ${character.name}`);
    }

    characterSprites.forEach(({ spriteName }) => {
      const key = `${character.name}_${spriteName}_${character.skin}`;
      const url = `${this.baseCharacterSpritesPath}/${character.name}/${character.skin}/${spriteName}.png`;

      if (this.scene.textures.exists(key)) return;
      if (this.loadingSpritesKeys.has(key)) return;

      this.loadingSpritesKeys.add(key);

      this.scene.load.once(`filecomplete-spritesheet-${key}`, () => {
        this.loadingSpritesKeys.delete(key);
      });

      this.scene.load.spritesheet(key, url, {
        frameWidth: PLAYER_DIMENSIONS.WIDTH,
        frameHeight: PLAYER_DIMENSIONS.HEIGHT,
      });
    });
  }

  private createPlayer({ character, equipment }: PlayerBuilderPayloadProp): PlayerEntity {
    const playerSprite = this.createPlayerSprite({ character, options: { friction: 0 } });
    const playerEntity = this.mountPlayerEntity({
      character,
      equipment,
      sprite: playerSprite,
    });

    return playerEntity;
  }

  private createPlayerSprite({ character, frame, options }: CreatePlayerSpriteProp) {
    const initialSprite = `${character.name}_spr_idle_${character.skin}`;
    const sprite = this.scene.matter.add.sprite(
      this.tempSpawnPoints.x,
      this.tempSpawnPoints.y,
      initialSprite,
      frame,
      options
    );

    sprite.setFixedRotation();
    sprite.setDepth(DEPTH.ENTITIES);

    return sprite;
  }

  private mountPlayerEntity({ character, equipment, sprite }: MountPlayerEntityProp): PlayerEntity {
    return {
      entityId: '', // This will be set by the EntityManager when registering the entity
      entityType: ENTITY_TYPES.PLAYER,
      sprite,
      character: {
        name: character.name,
        skin: character.skin,
      },
      input: defaultInput(),
      state: defaultState({ entityType: ENTITY_TYPES.PLAYER }),
      animation: defaultPlayerAnimation({ character }),
      movement: defaultMovement({ entityType: ENTITY_TYPES.PLAYER }),
      keymap: defaultKeymap({ player: character.playerRef }),
      equipment,
    };
  }
}

export { PlayerBuilder };
