import { EquipmentComponent } from '@/ecs/components';
import { DefaultEquipmentProp } from './type.p';

function defaultEquipment({ meleeEntityId }: DefaultEquipmentProp = {}): EquipmentComponent {
  return {
    weapons: {
      melee: {
        meleeEntityId,
      },
    },
  };
}

export { defaultEquipment };
