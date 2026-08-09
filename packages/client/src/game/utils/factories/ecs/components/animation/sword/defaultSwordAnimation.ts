import { SWORD_STATE } from '@/config/constants';
import { AnimationComponent } from '@/ecs/components';

function defaultSwordAnimation(): AnimationComponent {
  return {
    animations: {
      [SWORD_STATE.IDLE]: {
        key: 'spr_sword_idle',
        start: 0,
        end: 0,
        repeat: true,
        frameRate: 1,
        frames: [{ key: 'spr_sword_0' }],
      },
      [SWORD_STATE.SLASHING]: {
        key: 'spr_sword_slashing',
        start: 0,
        end: 4,
        repeat: false,
        frameRate: 15,
        frames: [
          { key: 'spr_sword_0' },
          { key: 'spr_sword_1' },
          { key: 'spr_sword_2' },
          { key: 'spr_sword_3' },
          { key: 'spr_sword_4' },
        ],
      },
    },
  };
}

export { defaultSwordAnimation };
