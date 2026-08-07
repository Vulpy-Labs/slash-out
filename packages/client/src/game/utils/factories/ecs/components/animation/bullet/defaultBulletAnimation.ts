import { GUN_STATE } from '@/config/constants';
import { AnimationComponent } from '@/ecs/components';

function defaultBulletAnimation(): AnimationComponent {
  return {
    animations: {
      [GUN_STATE.IDLE]: {
        key: 'spr_bullet_idle',
        start: 0,
        end: 0,
        repeat: true,
        frameRate: 1,
        frames: [{ key: 'spr_bullet_0' }],
      },
      [GUN_STATE.FIRING]: {
        key: 'spr_bullet_firing',
        start: 0,
        end: 1,
        repeat: true,
        frameRate: 10,
        frames: [{ key: 'spr_bullet_0' }, { key: 'spr_bullet_1' }],
      },
      [GUN_STATE.IN_FLIGHT]: {
        key: 'spr_bullet_firing',
        start: 0,
        end: 1,
        repeat: true,
        frameRate: 10,
        frames: [{ key: 'spr_bullet_0' }, { key: 'spr_bullet_1' }],
      },
    },
  };
}

export { defaultBulletAnimation };
