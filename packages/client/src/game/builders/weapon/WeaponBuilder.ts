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
      const playerBuilder = this.manager.getBuilderByType({ entityType: ENTITY_TYPES.PLAYER }) as
        | PlayerBuilder
        | undefined;
      const players = playerBuilder ? playerBuilder.getPlayers() : [];
      const playerEntity = players.find(p => p.character?.name === character.name);

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

    this.manager.getAll().delete(entity.entityId);
  }

  getWeapons(): WeaponEntity[] {
    return Array.from(this.manager.getAll().values()).filter(
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
