import { CHARACTERS_SPRITES_MODEL, DEPTH, PLAYER_DIMENSIONS } from '@/config/constants';

import {
  defaultInput,
  defaultKeymap,
  defaultMovement,
  defaultPlayerAnimation,
} from '@/utils/factories/ecs/components';

import { GlobalEntityMap } from '@/scenes/game';
import { PlayerEntity } from '@/ecs/entities';
import { MatchConfig } from '@/ecs/components';
import { CreatePlayerSpriteProp, MountPlayerEntityProp, PlayerBuilderProp } from './types.p';

class PlayerBuilder {
  private scene: Phaser.Scene;
  private matchConfig: MatchConfig;
  private entities: GlobalEntityMap;

  private baseCharacterSpritesPath = 'assets/sprites/characters';

  // ! Remove after the implementation of the respawn system
  private tempSpawnPoints = {
    x: 100,
    y: 100,
  };

  constructor({ scene, matchConfig, entities }: PlayerBuilderProp) {
    this.scene = scene;
    this.matchConfig = matchConfig;
    this.entities = entities;
  }

  load() {
    this.loadCharacterSprites();
  }

  build() {
    this.createPlayers();
  }

  private loadCharacterSprites() {
    this.matchConfig.players.characters.forEach(character => {
      const characterSprites = CHARACTERS_SPRITES_MODEL[character.name];

      if (!characterSprites) {
        throw new Error(`Sprite model not found for character: ${character.name}`);
      }

      characterSprites.forEach(({ spriteName }) => {
        const key = `${character.name}_${spriteName}_${character.skin}`;
        const url = `${this.baseCharacterSpritesPath}/${character.name}/${character.skin}/${spriteName}.png`;

        if (this.scene.textures.exists(key)) return;

        return this.scene.load.spritesheet(key, url, {
          frameWidth: PLAYER_DIMENSIONS.WIDTH,
          frameHeight: PLAYER_DIMENSIONS.HEIGHT,
        });
      });
    });
  }

  private getPlayerId() {
    let playerCount = 0;

    this.entities.forEach(({ entityId }) =>
      entityId.startsWith('player_') ? playerCount++ : null
    );

    return `player_0${playerCount + 1}`;
  }

  private createPlayers() {
    this.matchConfig.players.characters.forEach(character => {
      const playerId = this.getPlayerId();
      const playerSprite = this.createPlayerSprite({ character, options: { friction: 0 } });
      const playerEntity = this.mountPlayerEntity({
        entityId: playerId,
        character,
        sprite: playerSprite,
      });

      this.entities.set(playerEntity.entityId, playerEntity);
    });
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

  private mountPlayerEntity({ entityId, character, sprite }: MountPlayerEntityProp): PlayerEntity {
    return {
      entityId,
      sprite,
      character: {
        name: character.name,
        skin: character.skin,
      },
      input: defaultInput(),
      animation: defaultPlayerAnimation({ character }),
      movement: defaultMovement({ entityType: 'player' }),
      keymap: defaultKeymap({ player: character.playerRef }),
    };
  }
}

export { PlayerBuilder };
