# Implementation Plan - Sword Combat Mechanics (Animation-Driven, Simplified)

Implement the sword combat mechanics treating the Sword as a distinct entity, following the designs in [data_structures.md](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/data_structures.md) and incorporating your latest design feedback.

## User Review Required

> [!IMPORTANT]
> **Animation-Driven Cooldown:**
> As you suggested, we will eliminate the `cooldown` and `lastAttackTime` variables. We will manage attack readiness purely based on the sword's active slash animation:
> - If the sword sprite is visible and its slash animation is playing, new attack inputs are ignored.
> - Once the animation completes, the sword is hidden, parked at `(-1000, -1000)`, and the player is ready to attack again.
>
> **Simplified Equipment:**
> The player's `EquipmentComponent` will only store the reference ID `meleeEntityId` under `weapons.melee`. There are no gun/range weapon placeholders, plain strings, or redundant weapon stats stored on the player.
>
> **No Attack Lock:**
> There is no movement or state lock. Players can move and transition states freely during slashes.

## Open Questions

None. The simplified animation-driven approach keeps the state extremely clean and robust.

---

## Proposed Changes

### Configuration & Constants

#### [MODIFY] [entityTypes.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/config/constants/entity-types/entityTypes.ts)
- Add `SWORD: 'sword'` to `ENTITY_TYPES` (matching `'sword'` lowercase).

---

### ECS Components

#### [NEW] [EquipmentComponent.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/components/equipment/EquipmentComponent.ts)
- Define the parent equipment component holding references to weapon entities:
  ```typescript
  interface EquipmentComponent {
    weapons: {
      melee?: {
        meleeEntityId?: string;
      };
    };
  }
  export type { EquipmentComponent };
  ```

#### [NEW] [DamageComponent.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/components/damage/DamageComponent.ts)
- Define `DamageComponent` for reusable damage attributes:
  ```typescript
  interface DamageComponent {
    base: number;
    multiplier: number; // default: 1
  }
  ```

#### [MODIFY] [match.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/components/match/match.ts)
- Refactor `MatchConfig` and `MatchConfigPlayers` to follow the array of `{ character, equipment }` pattern from `data_structures.md`.

#### [MODIFY] [AllComponents.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/components/all/AllComponents.ts)
- Add optional `damage?: DamageComponent` and `equipment?: EquipmentComponent` fields to `AllComponentsList`.

#### [MODIFY] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/components/index.ts)
- Export the `damage` and `equipment` component modules.

---

### ECS Factories

#### [NEW] [defaultDamage.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/utils/factories/ecs/components/damage/defaultDamage.ts)
- Factory initializing standard damage attributes.

#### [NEW] [defaultEquipment.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/utils/factories/ecs/components/equipment/defaultEquipment.ts)
- Factory initializing player equipment with default weapon slot structures.

#### [MODIFY] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/utils/factories/ecs/components/index.ts)
- Export the new component factories.

---

### ECS Entities & Builders

#### [NEW] [WeaponEntity.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/entities/weapon/WeaponEntity.ts)
- Define `WeaponEntity` containing its own damage and animation state (with no cooldown timers):
  ```typescript
  interface WeaponEntity extends BaseEntity {
    entityId: string;
    entityType: typeof ENTITY_TYPES.SWORD;
    sprite: Phaser.Physics.Matter.Sprite;
    ownerEntityId: string;
    damage: DamageComponent;
    animation: AnimationComponent;
  }
  ```

#### [NEW] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/entities/weapon/index.ts)
- Export `WeaponEntity`.

#### [MODIFY] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/entities/index.ts)
- Export `weapon` entity module.

#### [MODIFY] [PlayerEntity.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/entities/player/PlayerEntity.ts)
- Include `equipment: EquipmentComponent` as a player property.

#### [MODIFY] [types.p.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/player/types.p.ts)
- Remove `onEntityCreated` callback references and types from builder props. Include `equipment` configuration in `PlayerBuilderPayloadProp` and other builder props.

#### [MODIFY] [PlayerBuilder.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/player/PlayerBuilder.ts)
- Update `.build()` to return the instantiated `PlayerEntity` instead of triggering a side-effect callback. Mount `equipment` component initialized from payload config.

#### [NEW] [types.p.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/weapon/types.p.ts)
- Define destructuring type structures for `WeaponBuilder`.

#### [NEW] [WeaponBuilder.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/weapon/WeaponBuilder.ts)
- Add decoupled weapon builder supporting:
  - `.load()`: Load sword assets (`spr_sword_0.png` through `spr_sword_4.png`).
  - `.build({ ownerEntityId, damage })`: Return a Matter sensor-based `WeaponEntity` initialized at `(-1000, -1000)`.

#### [NEW] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/weapon/index.ts)
- Export `WeaponBuilder`.

#### [MODIFY] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/builders/index.ts)
- Export `weapon` builder module.

---

### Systems & Managers

#### [MODIFY] [EntityManager.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/managers/entity/EntityManager.ts)
- Instantiate and integrate `WeaponBuilder`.
- Update `createPlayers()` to:
  1. Iterate over players.
  2. Build and register player entities.
  3. Build and register weapon entities based on player equipment.
  4. Link the weapon entity ID into `player.equipment.weapons.melee.meleeEntityId`.
- Update `registerEntity` to write the entity's ID directly onto Phaser sprite data (`sprite.setData('entityId', entity.entityId)`).

#### [NEW] [types.p.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/systems/combat/types.p.ts)
- Prop types for `CombatSystem` constructor and updates.

#### [NEW] [CombatSystem.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/systems/combat/CombatSystem.ts)
- Coordinates player attack inputs and sword animations.
- Prevent new attacks from firing if the slash animation is already active (`sprite.visible === true`).
- Position the sword sprite dynamically based on player orientation and attack direction (`forward`, `up`, `down`).
- Automatically hides and parks the sword at `(-1000, -1000)` when the animation completes.
- Handles Matter collision events to detect hits between active swords and players.

#### [NEW] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/systems/combat/index.ts)
- Export `CombatSystem`.

#### [MODIFY] [index.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/ecs/systems/index.ts)
- Export the `combat` system.

#### [MODIFY] [Preloader.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/scenes/core/preloader/Preloader.ts)
- Update default preloader config payload to match the array-based player config containing `character` and `equipment: defaultEquipment()`.

#### [MODIFY] [MatchScene.ts](file:///Ubuntu-20.04/home/pedro/workspaces/projects/gamedev/phaser/2d-game/slash-out/packages/client/src/game/scenes/game/match/MatchScene.ts)
- Integrate, load assets, and execute `CombatSystem` update ticks.

---

## Verification Plan

### Automated Verification
- Code compilation: verify that there are no TypeScript syntax or type errors.

### Manual Verification
- Launch the game locally.
- Press `J` (Player 1) or `Numpad 3` (Player 2) to trigger sword attacks.
- Verify the sword appears, slashes (cycles frames 0-4), and is removed correctly (hidden and moved to `-1000, -1000`).
- Check the console for successful collision logs when a sword overlaps with the opposing player.
