import type { ECSComponent } from '../../components';
// import { getComponentProp } from './types';

export class EntityFactory {
  private id: string;
  private components: Map<string, Class>;

  constructor(id: string) {
    this.id = id;
    this.components = new Map();
  }

  private addComponent({ component }: ECSComponent) {
    return this.components.set(component.constructor.name, component);
  }

  private getComponent({ component }: ECSComponent) {
    return this.components.get(component.constructor.name);
  }

  private hasComponent({ component }: ECSComponent) {
    return this.components.has(component.constructor.name);
  }
}
