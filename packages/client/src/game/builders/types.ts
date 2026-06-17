import type { GlobalEntity } from '@/ecs/entities';

export interface EntityBuilder {
  load(): void;
  build(): void;
  generateId(): string;
  destroy(entity: GlobalEntity): void;
}
