import { AllComponentsList } from '@/ecs/components';
import { BaseEntity } from '../';

interface GlobalEntity extends BaseEntity, AllComponentsList {}

export type { GlobalEntity };
