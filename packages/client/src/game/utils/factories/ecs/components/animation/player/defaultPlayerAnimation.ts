import { CHARACTERS_SPRITES_MODEL } from '@/config/constants';
import { AnimationComponent } from '@/ecs/components';
import { DefaultPlayerAnimationProp } from './types.p';

function defaultPlayerAnimation({ character }: DefaultPlayerAnimationProp): AnimationComponent {
  let animationsConfig = CHARACTERS_SPRITES_MODEL[character.name];

  if (!animationsConfig) {
    console.warn(`No sprite configuration was found for character: ${character.name}.`);
    animationsConfig = [];
  }

  const animations = animationsConfig.reduce(
    (acc, { key, ...anim }) => {
      acc[key] = {
        key: `${character.name}_${anim.spriteName}_${character.skin}`,
        ...anim,
      };

      return acc;
    },
    {} as AnimationComponent['animations']
  );

  return {
    animations,
    flipX: null,
    currentState: 'IDLE',
  };
}

export { defaultPlayerAnimation };
