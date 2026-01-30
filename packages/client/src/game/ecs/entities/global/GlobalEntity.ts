import { AllComponentsList } from '@/ecs/components';
import { BaseEntity } from '../base';

interface GlobalEntity extends BaseEntity, AllComponentsList {}

export type { GlobalEntity };
