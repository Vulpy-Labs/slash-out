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
          if (typeof spriteA.getData !== 'function' || typeof spriteB.getData !== 'function')
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
