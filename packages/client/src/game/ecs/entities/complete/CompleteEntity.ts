import { InputComponent, KeymapComponent } from 'ecs/components';

interface BaseEntity {
  entityId: string;
}

interface allComponentsList {
  keymap: KeymapComponent;
  input: InputComponent;
}

interface CompleteEntity extends BaseEntity, allComponentsList {}

type Entities = Map<string, CompleteEntity>;

export type { Entities };
