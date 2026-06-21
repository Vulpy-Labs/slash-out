import { AnimationSystemProp, AnimationSystemPayloadProp } from './types.p';

class AnimationSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: AnimationSystemProp) {
    this.scene = scene;
  }

  create({ entities }: AnimationSystemPayloadProp) {
    entities.forEach(({ animation, entityId }) => {
      if (!animation) return;

      Object.values(animation.animations).forEach((anim, index) => {
        if (!anim?.key) {
          console.warn(`No animation key was found in index ${index} for entity ${entityId}.`);
          return;
        }

        // console.log(this.scene.anims.exists(anim.key));
        if (this.scene.anims.exists(anim.key)) return;

        const frames = anim.frames?.length
          ? anim.frames
          : this.scene.anims.generateFrameNumbers(anim.key, {
            start: anim.start,
            end: anim.end,
          });

        if (!frames?.length) {
          console.warn(
            `Could not generate frames for ${anim.key}. Check if it was loaded as spritesheet.`
          );
          return;
        }

        this.scene.anims.create({
          frames,
          key: anim.key,
          frameRate: anim.frameRate,
          repeat: anim.repeat ? -1 : 0,
        });
      });
    });
  }

  update({ entities }: AnimationSystemPayloadProp) {
    entities.forEach(({ animation, sprite, state, entityId }) => {
      if (!animation || !sprite) return;

      let targetAnimKey;

      if (typeof animation.flipX === 'boolean') {
        sprite.setFlipX(animation.flipX);
      }

      // console.log(`${entityId} ${JSON.stringify(animation.animations)}`);
      if (state) {
        targetAnimKey = animation.animations[state.current as keyof typeof animation.animations];
      } else {
        targetAnimKey = Object.values(animation.animations)[0];
      }

      // console.log(`targetAnimKey`, targetAnimKey);
      if (!targetAnimKey) return;

      const isCurrentAnimation = sprite.anims.currentAnim?.key === targetAnimKey.key;
      // console.log(`isCurrentAnimation`, isCurrentAnimation);

      if (!isCurrentAnimation) {
        sprite.anims.play(targetAnimKey.key, true);
      }
    });
  }
}

export { AnimationSystem };
