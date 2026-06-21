// PR - 1
# Refactoring Handover Document

In case you lose all progress and need to rebuild these changes from scratch, this file contains the complete source code for each created/modified file. 

## Files Snapshot

---

### 1. Config & Constants

#### [NEW] [weapons.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/config/constants/weapon/weapons.ts)
```typescript
export const SWORD = {
  CONFIG: {
    WIDTH: 48,
    HEIGHT: 24,
    ORIGIN_X: 0.5,
    ORIGIN_Y: 0.5,
    OFFSET: 10,
  },
  ATTACK: {
    DAMAGE: {
      BASE: 15,
      MULTIPLIER: 1,
    },
  },
} as const;

export const BULLET = {
  CONFIG: {
    WIDTH: 16,
    HEIGHT: 16,
    ORIGIN_X: 0.5,
    ORIGIN_Y: 0.5,
    ANGLE: 0,
  },
  ATTACK: {
    CLIP_SIZE: 3,
    VELOCITY: 4,
    DAMAGE: {
      BASE: 100,
      MULTIPLIER: 1,
    },
  },
} as const;
```

#### [DEPRECATED] [weaponStats.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/config/constants/weapon/weaponStats.ts)
- Exists as a deprecated skeleton to prevent compilation issues:
```typescript
// Deprecated: Use weapons.ts instead
export {};
```

#### [MODIFY] [index.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/config/constants/index.ts)
```typescript
export * from './possible-actions';
export * from './conflicting-actions';
export * from './movement';
export * from './scene';
export * from './physics';
export * from './depth';
export * from './character';
export * from './dimensions';
export * from './state';
export * from './entity-types';
export * from './weapon/weapons';
```

---

### 2. Utils & Factories

#### [MODIFY] [defaultDamage.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/utils/factories/ecs/components/damage/defaultDamage.ts)
```typescript
import type { DamageComponent } from '@/ecs/components';
import { SWORD } from '@/config/constants';
import type { DefaultDamageProp } from './type.p';

function defaultDamage({
  base = SWORD.ATTACK.DAMAGE.BASE,
  multiplier = SWORD.ATTACK.DAMAGE.MULTIPLIER,
}: DefaultDamageProp = {}): DamageComponent {
  return {
    base,
    multiplier,
  };
}

export { defaultDamage };
```

---

### 3. Shared Builder Interface

#### [NEW] [types.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/types.ts)
```typescript
import type { GlobalEntity } from '@/ecs/entities';

export interface EntityBuilder {
  load(): void;
  build(): void;
  generateId(): string;
  destroy(entity: GlobalEntity): void;
}
```

---

### 4. Player Builder

#### [MODIFY] [types.p.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/player/types.p.ts)
```typescript
import { MatchConfigCharacter, EquipmentComponent } from '@/ecs/components';
import type { EntityManager } from '@/managers/entity/EntityManager';

type PlayerBuilderProp = {
  manager: EntityManager;
};

type PlayerBuilderPayloadProp = {
  character: MatchConfigCharacter;
  equipment?: EquipmentComponent;
};

type CreatePlayerSpriteProp = {
  character: MatchConfigCharacter;
  frame?: string | number;
  options?: Phaser.Types.Physics.Matter.MatterBodyConfig;
};

type MountPlayerEntityProp = {
  character: MatchConfigCharacter;
  equipment?: EquipmentComponent;
  sprite: Phaser.Physics.Matter.Sprite;
};

type LoadCharacterSpritesProp = {
  character: MatchConfigCharacter;
};

export type {
  PlayerBuilderProp,
  MountPlayerEntityProp,
  CreatePlayerSpriteProp,
  PlayerBuilderPayloadProp,
  LoadCharacterSpritesProp,
};
```

#### [MODIFY] [PlayerBuilder.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/player/PlayerBuilder.ts)
```typescript
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

  getPlayers(): PlayerEntity[] {
    return Array.from(this.manager.getAllEntities().values()).filter(
      (entity): entity is PlayerEntity => entity.entityType === ENTITY_TYPES.PLAYER
    );
  }

  load() {
    this.manager.matchConfig.players.forEach(({ character }) => {
      this.loadCharacterSprites({ character });
    });
  }

  build() {
    this.manager.matchConfig.players.forEach(({ character, equipment }) => {
      const playerEntity = this.createPlayer({ character, equipment });

      this.manager.registerEntity({ entity: playerEntity });
    });
  }

  generateId(): string {
    const players = this.getPlayers();
    let playerCount = players.length + 1;

    while (players.some((p) => p.entityId === `${ENTITY_TYPES.PLAYER}_0${playerCount}`)) {
      playerCount++;
    }

    return `${ENTITY_TYPES.PLAYER}_0${playerCount}`;
  }

  destroy(entity: GlobalEntity) {
    this.manager.getAllEntities().forEach((ent) => {
      const isOwnedByDestroyedPlayer = 'ownerEntityId' in ent && ent.ownerEntityId === entity.entityId;
      if (isOwnedByDestroyedPlayer) {
        const builder = this.manager.getBuilderByType({ entityType: ent.entityType });
        if (builder) {
          builder.destroy(ent);
        }
      }
    });

    if (entity.sprite) {
      entity.sprite.destroy();
    }

    this.manager.getAllEntities().delete(entity.entityId);
  }

  private loadCharacterSprites({ character }: LoadCharacterSpritesProp) {
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
      state: defaultState(),
      animation: defaultPlayerAnimation({ character }),
      movement: defaultMovement({ entityType: ENTITY_TYPES.PLAYER }),
      keymap: defaultKeymap({ player: character.playerRef }),
      equipment,
    };
  }
}

export { PlayerBuilder };
```

---

### 5. Weapon Builder

#### [MODIFY] [types.p.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/weapon/types.p.ts)
```typescript
import { DamageComponent } from '@/ecs/components';
import type { EntityManager } from '@/managers/entity/EntityManager';

type WeaponBuilderProp = {
  manager: EntityManager;
};

type WeaponBuilderBuildProp = {
  ownerEntityId: string;
  damage?: DamageComponent;
};

export type {
  WeaponBuilderProp,
  WeaponBuilderBuildProp,
};
```

#### [MODIFY] [WeaponBuilder.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/weapon/WeaponBuilder.ts)
```typescript
import type { PlayerBuilder } from '../player/PlayerBuilder';
import type { EntityBuilder } from '../types';
import type { EntityManager } from '@/managers/entity/EntityManager';
import { ENTITY_TYPES, DEPTH, SWORD } from '@/config/constants';
import type { WeaponEntity, GlobalEntity } from '@/ecs/entities';
import { defaultDamage } from '@/utils/factories/ecs/components';
import type { WeaponBuilderProp, WeaponBuilderBuildProp } from './types.p';

class WeaponBuilder implements EntityBuilder {
  private readonly manager: EntityManager;
  private readonly scene: Phaser.Scene;
  private readonly swordFramesCount = 5;

  constructor({ manager }: WeaponBuilderProp) {
    this.manager = manager;
    this.scene = manager.scene;
  }

  load() {
    for (let i = 0; i < this.swordFramesCount; i++) {
      const key = `spr_sword_${i}`;
      const url = `assets/sprites/combat/melee/spr_sword/spr_sword_${i}.png`;

      if (!this.scene.textures.exists(key)) {
        this.scene.load.image(key, url);
      }
    }
  }

  build() {
    this.manager.matchConfig.players.forEach(({ character, equipment }) => {
      const playerBuilder = this.manager.getBuilderByType({ entityType: ENTITY_TYPES.PLAYER }) as PlayerBuilder | undefined;
      const players = playerBuilder ? playerBuilder.getPlayers() : [];
      const playerEntity = players.find(
        p => p.character?.name === character.name
      );

      if (!playerEntity) return;

      if (equipment?.weapons?.melee) {
        const weaponEntity = this.buildWeapon({
          ownerEntityId: playerEntity.entityId,
          damage: {
            base: SWORD.ATTACK.DAMAGE.BASE,
            multiplier: SWORD.ATTACK.DAMAGE.MULTIPLIER,
          },
        });

        this.manager.registerEntity({ entity: weaponEntity });

        // Link weapon entity to player's equipment
        if (!playerEntity.equipment) {
          playerEntity.equipment = { weapons: {} };
        }
        playerEntity.equipment.weapons.melee = {
          meleeEntityId: weaponEntity.entityId,
        };
      }
    });
  }

  generateId(): string {
    const weapons = this.getWeapons();
    let weaponCount = weapons.length + 1;

    if (ENTITY_TYPES.SWORD) {
      while (weapons.find(w => w.entityId === `${ENTITY_TYPES.SWORD}_0${weaponCount}`)) {
        weaponCount++;
      }
    }

    return `${ENTITY_TYPES.SWORD}_0${weaponCount}`;
  }

  destroy(entity: GlobalEntity) {
    if (entity.sprite) {
      entity.sprite.destroy();
    }

    this.manager.getAllEntities().delete(entity.entityId);
  }

  getWeapons(): WeaponEntity[] {
    return Array.from(this.manager.getAllEntities().values()).filter(
      (entity): entity is WeaponEntity => entity.entityType === ENTITY_TYPES.SWORD
    );
  }

  private buildWeapon({ ownerEntityId, damage }: WeaponBuilderBuildProp): WeaponEntity {
    const sprite = this.createSprite(ownerEntityId);
    const frames = this.generateAnimationFrames();
    const weaponDamage = this.resolveDamage(damage);

    return this.assembleEntity({ ownerEntityId, sprite, frames, damage: weaponDamage });
  }

  private createSprite(ownerEntityId: string): Phaser.Physics.Matter.Sprite {
    const initialSpriteKey = 'spr_sword_0';
    const sprite = this.scene.matter.add.sprite(-1000, -1000, initialSpriteKey, undefined, {
      isSensor: true,
      label: 'sword_sensor',
    });

    sprite.setDepth(DEPTH.ENTITIES + 1);
    sprite.setVisible(false);
    sprite.setData('ownerEntityId', ownerEntityId);

    return sprite;
  }

  private generateAnimationFrames() {
    return Array.from({ length: this.swordFramesCount }, (_, i) => ({
      key: `spr_sword_${i}`,
    }));
  }

  private resolveDamage(damage?: WeaponBuilderBuildProp['damage']) {
    return (
      damage ||
      defaultDamage({
        base: SWORD.ATTACK.DAMAGE.BASE,
        multiplier: SWORD.ATTACK.DAMAGE.MULTIPLIER,
      })
    );
  }

  private assembleEntity({
    ownerEntityId,
    sprite,
    frames,
    damage,
  }: {
    ownerEntityId: string;
    sprite: Phaser.Physics.Matter.Sprite;
    frames: { key: string }[];
    damage: WeaponBuilderBuildProp['damage'];
  }): WeaponEntity {
    return {
      entityId: '',
      entityType: ENTITY_TYPES.SWORD,
      sprite,
      ownerEntityId,
      damage: damage!,
      animation: {
        animations: {
          slash: {
            key: `sword_slash_${ownerEntityId}`,
            frames,
            frameRate: 15,
            repeat: false,
          },
        },
      },
    };
  }
}

export { WeaponBuilder };
```

---

### 6. Entity Manager

#### [MODIFY] [types.p.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/managers/entity/types.p.ts)
```typescript
import { GlobalEntity } from '@/ecs/entities';
import { MatchConfig } from '@/ecs/components';

type RegisterEntityOptionsProp = {
  isPlayer?: boolean;
  type?: string;
};

type EntityManagerProp = {
  scene: Phaser.Scene;
  matchConfig: MatchConfig;
};

type RegisterEntityProp = {
  entity: GlobalEntity;
  options?: RegisterEntityOptionsProp;
};

type DestroyEntityProp = {
  id: string;
};

type GetBuilderByTypeProp = {
  entityType: string;
};

type GetEntityByIdProp = {
  id: string;
};

export type {
  EntityManagerProp,
  RegisterEntityProp,
  DestroyEntityProp,
  GetBuilderByTypeProp,
  GetEntityByIdProp,
};
```

#### [MODIFY] [EntityManager.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/managers/entity/EntityManager.ts)
```typescript
import { PlayerBuilder, WeaponBuilder } from '@/builders';
import type { EntityBuilder } from '@/builders/types';
import type { GlobalEntityMap } from '@/scenes/game';
import type { MatchConfig } from '@/ecs/components';
import { ENTITY_TYPES } from '@/config/constants';
import type {
  DestroyEntityProp,
  EntityManagerProp,
  RegisterEntityProp,
  GetBuilderByTypeProp,
  GetEntityByIdProp,
} from './types.p';

class EntityManager {
  public readonly scene: Phaser.Scene;
  public readonly matchConfig: MatchConfig;

  private readonly entities: GlobalEntityMap = new Map();
  private readonly builders: Map<string, EntityBuilder> = new Map();

  constructor({ scene, matchConfig }: EntityManagerProp) {
    this.scene = scene;
    this.matchConfig = matchConfig;

    this.initializeInstances();
  }

  load() {
    this.builders.forEach(EntityBuilder => EntityBuilder.load());
  }

  build() {
    this.builders.forEach(EntityBuilder => EntityBuilder.build());
  }

  getAllEntities() {
    return this.entities;
  }

  getEntityById({ id }: GetEntityByIdProp) {
    return this.entities.get(id);
  }

  destroyEntityById({ id }: DestroyEntityProp) {
    const entity = this.entities.get(id);

    if (!entity) {
      console.warn(`Entity with id ${id} not found to destroy.`);
      return;
    }

    const entityBuilder = this.getBuilderByType({ entityType: entity.entityType });
    if (!entityBuilder) {
      throw new Error(`Builder not found for entity type: ${entity.entityType}`);
    }

    entityBuilder.destroy(entity);
  }

  registerEntity({ entity }: RegisterEntityProp) {
    const entityBuilder = this.getBuilderByType({ entityType: entity.entityType });
    if (!entityBuilder) {
      throw new Error(`Builder not found for entity type: ${entity.entityType}`);
    }

    entity.entityId = entityBuilder.generateId();

    if (entity.sprite) {
      entity.sprite.setData('entityId', entity.entityId);
    }

    this.entities.set(entity.entityId, entity);
  }

  getBuilderByType({ entityType }: GetBuilderByTypeProp): EntityBuilder | undefined {
    return this.builders.get(entityType);
  }

  private initializeInstances() {
    this.initializeBuilders();
  }

  private initializeBuilders() {
    this.builders.set(ENTITY_TYPES.PLAYER, new PlayerBuilder({ manager: this }));
    this.builders.set(ENTITY_TYPES.SWORD, new WeaponBuilder({ manager: this }));
  }
}

export { EntityManager };
```

#### [DEPRECATED] [EntityManagerEx.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/managers/entity/EntityManagerEx.ts)
- Exists as a deprecated skeleton to prevent compilation issues:
```typescript
// Deprecated: Refactored and merged into EntityManager.ts
export {};
```

---

### 7. Match Scene

#### [MODIFY] [MatchScene.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/scenes/game/match/MatchScene.ts)
```typescript
import { MapBuilder } from '@/builders';
import { EntityManager } from '@/managers';
import { MatchConfig } from '@/ecs/components';
import {
  AnimationSystem,
  InputSystem,
  KeymapSystem,
  MovementSystem,
  VelocitySystem,
  StateSystem,
  CombatSystem,
} from '@/ecs/systems';

import { GlobalEntityMap } from './type.i';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;

  private entities: GlobalEntityMap = new Map();

  private entityManager: EntityManager;

  private mapBuilder: MapBuilder;

  private keymapSystem: KeymapSystem;
  private inputSystem: InputSystem;
  private stateSystem: StateSystem;
  private combatSystem: CombatSystem;
  private movementSystem: MovementSystem;
  private velocitySystem: VelocitySystem;
  private animationSystem: AnimationSystem;

  constructor() {
    super('MatchScene');
  }

  init(data: MatchConfig) {
    this.matchConfig = data;

    this.initializeInstances();
    this.initializeEntities();
  }

  initializeInstances() {
    this.initializeSystems();
    this.initializeBuilders();
    this.initializeManagers();
  }

  initializeSystems() {
    this.keymapSystem = new KeymapSystem({ scene: this });
    this.inputSystem = new InputSystem();
    this.movementSystem = new MovementSystem();
    this.velocitySystem = new VelocitySystem({ scene: this });
    this.stateSystem = new StateSystem();
    this.combatSystem = new CombatSystem({ scene: this });
    this.animationSystem = new AnimationSystem({ scene: this });
  }

  initializeBuilders() {
    this.mapBuilder = new MapBuilder({ scene: this, mapName: this.matchConfig.mapName });
  }

  initializeManagers() {
    this.entityManager = new EntityManager({
      scene: this,
      matchConfig: this.matchConfig,
    });
  }

  initializeEntities() {
    this.entities = this.entityManager.getAllEntities();
  }

  preload() {
    this.mapBuilder.load();
    this.entityManager.load();
  }

  create() {
    this.createMap();
    this.createPlayers();
    this.createKeyboardInputs();
    this.createAnimations();

    console.log(this.entities);
  }

  createMap() {
    this.mapBuilder.build();
  }

  createPlayers() {
    this.entityManager.build();
  }

  createKeyboardInputs() {
    this.keymapSystem.createPhaserListeners({ entities: this.entities });
  }

  createAnimations() {
    this.animationSystem.create({ entities: this.entities });
  }

  update() {
    this.inputSystem.update({ entities: this.entities });
    this.movementSystem.update({ entities: this.entities });
    this.velocitySystem.update({ entities: this.entities });
    this.stateSystem.update({ entities: this.entities });
    this.combatSystem.update({ entities: this.entities });
    this.animationSystem.update({ entities: this.entities });
  }
}
```

---

### 8. Combat System

#### [MODIFY] [CombatSystem.ts](file:///wsl.localhost/Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/systems/combat/CombatSystem.ts)
```typescript
import { CHARACTER_STATE, ENTITY_TYPES } from '@/config/constants';
import { PlayerEntity, WeaponEntity } from '@/ecs/entities';
import { CombatSystemProp, CombatSystemUpdateProp } from './types.p';

class CombatSystem {
  private readonly scene: Phaser.Scene;

  constructor({ scene }: CombatSystemProp) {
    this.scene = scene;
    this.initializeCollisions();
  }

  update({ entities }: CombatSystemUpdateProp) {
    // Find all players
    const players = Array.from(entities.values()).filter(
      e => e.entityType === ENTITY_TYPES.PLAYER
    ) as PlayerEntity[];

    players.forEach(player => {
      const meleeEntityId = player.equipment?.weapons?.melee?.meleeEntityId;
      if (!meleeEntityId) return;

      const sword = entities.get(meleeEntityId) as WeaponEntity;
      if (!sword || !sword.sprite) return;

      const isCurrentStateAttack =
        player.state.current === CHARACTER_STATE.SHORT_ATTACK_FORWARD ||
        player.state.current === CHARACTER_STATE.SHORT_ATTACK_UP ||
        player.state.current === CHARACTER_STATE.SHORT_ATTACK_DOWN;

      // If sword is currently slashing (visible)
      if (sword.sprite.visible) {
        // If the slash animation finished, deactivate/hide the sword
        if (!sword.sprite.anims.isPlaying) {
          sword.sprite.setVisible(false);
          sword.sprite.setPosition(-1000, -1000);
          player.state.current = CHARACTER_STATE.IDLE;
        } else {
          // Keep player in the active attack state
          const activeState = sword.sprite.getData('activeAttackState');
          if (activeState && player.state.current !== activeState) {
            player.state.current = activeState;
          }

          // Position the sword relative to the player
          this.positionSword({ player, sword });
        }
      } else if (isCurrentStateAttack) {
        // Start the attack slash!
        sword.sprite.setVisible(true);
        sword.sprite.setData('activeAttackState', player.state.current);
        sword.sprite.anims.play(sword.animation.animations.slash.key, true);
        this.positionSword({ player, sword });
      }
    });
  }

  private positionSword({ player, sword }: { player: PlayerEntity; sword: WeaponEntity }) {
    const activeState = sword.sprite.getData('activeAttackState');
    const isFacingLeft = player.sprite.flipX;

    let offset = { x: 0, y: 0 };
    let rotation = 0;

    if (activeState === CHARACTER_STATE.SHORT_ATTACK_UP) {
      offset = { x: 0, y: -24 };
      rotation = -Math.PI / 2; // -90 deg
    } else if (activeState === CHARACTER_STATE.SHORT_ATTACK_DOWN) {
      offset = { x: 0, y: 24 };
      rotation = Math.PI / 2; // 90 deg
    } else {
      // Forward attack
      offset = { x: isFacingLeft ? -24 : 24, y: 0 };
      rotation = 0;
    }

    sword.sprite.setPosition(player.sprite.x + offset.x, player.sprite.y + offset.y);
    sword.sprite.setRotation(rotation);
    sword.sprite.setFlipX(isFacingLeft);
  }

  private initializeCollisions() {
    this.scene.matter.world.on(
      'collisionstart',
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        event.pairs.forEach(pair => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;

          const spriteA = bodyA.gameObject as Phaser.GameObjects.GameObject;
          const spriteB = bodyB.gameObject as Phaser.GameObjects.GameObject;

          if (!spriteA || !spriteB) return;
          if (
            typeof spriteA.getData !== 'function' ||
            typeof spriteB.getData !== 'function'
          )
            return;

          const entityIdA = spriteA.getData('entityId') as string | undefined;
          const entityIdB = spriteB.getData('entityId') as string | undefined;

          if (!entityIdA || !entityIdB) return;

          this.handleHit({
            spriteA: spriteA as Phaser.Physics.Matter.Sprite,
            entityIdB,
          });
          this.handleHit({
            spriteA: spriteB as Phaser.Physics.Matter.Sprite,
            entityIdB: entityIdA,
          });
        });
      }
    );
  }

  private handleHit({
    spriteA,
    entityIdB,
  }: {
    spriteA: Phaser.Physics.Matter.Sprite;
    entityIdB: string;
  }) {
    if (spriteA.label === 'sword_sensor' && spriteA.visible) {
      const ownerEntityId = spriteA.getData('ownerEntityId');
      if (ownerEntityId && entityIdB !== ownerEntityId) {
        console.log(`[Combat] Player ${ownerEntityId}'s sword hit Player ${entityIdB}!`);
      }
    }
  }
}

export { CombatSystem };
```
