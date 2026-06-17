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
