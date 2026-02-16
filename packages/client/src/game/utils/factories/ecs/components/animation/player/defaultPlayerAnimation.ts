import { CHARACTERS_SPRITES_MODEL } from '@/config/constants';
import { AnimationComponent } from '@/ecs/components';
import { DefaultPlayerAnimationProp } from './type.p';

function defaultPlayerAnimation({ character }: DefaultPlayerAnimationProp): AnimationComponent {
  let animationsConfig = CHARACTERS_SPRITES_MODEL[character.name];

  if (!animationsConfig) {
    console.warn(`No sprite configuration was found for character: ${character.name}.`);
    animationsConfig = [];
  }

  const animations = animationsConfig.reduce(
    (acc, { key, spriteName, ...anim }) => {
      acc[key] = {
        key: `${character.name}_${spriteName}_${character.skin}`,
        ...anim,
      };

      return acc;
    },
    {} as AnimationComponent['animations']
  );

  return {
    animations,
    currentState: 'IDLE',
  };
}

export { defaultPlayerAnimation };
