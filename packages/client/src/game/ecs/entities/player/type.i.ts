import { InputComponent } from '@/ecs/components/input';

/**
 * Todo: () => PlayerEntity => PlayerFactory && Player => PlayerEntity?
 */
export interface Player {
  entityId: string;
  body: MatterJS.BodyType;
  input?: InputComponent;
}
