# Data Structures: Weapons as Entities Overview

This document provides a comparative overview of the ECS data structures under the **"Weapons as Entities"** architecture (our current design), incorporating SOLID design feedback.

---

## 1. Match Configuration (`matchConfig`)

The configuration defines the initial conditions passed from the preloader scene to build the match.

### Config Layout (`MatchConfig`)
The equipment configuration is defined alongside the character details for each player.

```typescript
// packages/client/src/game/ecs/components/match/match.ts
interface MatchConfig {
  mapName: string;
  players: MatchConfigPlayers;
}

type MatchConfigPlayers = {
  character: MatchConfigCharacter;
  equipment: EquipmentComponent;
}[];

// packages/client/src/game/ecs/components/match/character-config/CharacterConfig.ts
interface MatchConfigCharacter {
  playerRef: '01' | '02';
  name: string; // e.g., 'otomo'
  skin: string; // e.g., 'v1'
}
```

---

## 2. Entity Definitions

In this architecture, both the Player and the Sword are distinct entities. They are registered under the global `entities` map with their own lifecycles.

```typescript
// Player Entity
interface PlayerEntity extends BaseEntity {
  entityId: string;
  entityType: typeof ENTITY_TYPES.PLAYER;
  sprite: Phaser.Physics.Matter.Sprite;
  character: CharacterComponent;
  input: InputComponent;
  state: StateComponent;
  animation: AnimationComponent;
  movement: MovementComponent;
  keymap: KeymapComponent;
  equipment: EquipmentComponent;
}

// Weapon Entity (Sword)
interface WeaponEntity extends BaseEntity {
  entityId: string;
  entityType: typeof ENTITY_TYPES.SWORD; // Uses ENTITY_TYPES instead of plain string
  sprite: Phaser.GameObjects.Sprite;
  ownerEntityId: string; // Reference to owner PlayerEntity
  damage: DamageComponent; // Reusable component instead of custom stats
  animation: AnimationComponent;
}
```

---

## 3. Component Schemas (Refactored for SOLID)

### A. Damage Component (`DamageComponent`)
Instead of a weapon-specific `WeaponStatsComponent`, we use a generic `DamageComponent` that stores damage parameters. This can be attached to any entity (players, weapons, hazards).

```typescript
// packages/client/src/game/ecs/components/damage/DamageComponent.ts
interface DamageComponent {
  base: number;
  multiplier: number; // default: 1
}
```

### B. Weapon State & Types (Removed Redundancy)
* **`WeaponStateComponent` is Removed**: We do not need a custom weapon state component. We leverage the owner player's existing components:
  * `isAttackActive` is derived directly from the owner player's current state (checking if `player.state.current` matches an attack state).
  * `activeAttackState` is obtained from the owner player's current state (`player.state.current`).
  * `activeFlipX` is obtained from the owner player's sprite direction (`player.sprite.flipX`), and flipped/rotated via combat calculation.
* **Redundant Type Strings Removed**: We do not store redundant `'SWORD'` strings inside stats or states. The entity's `entityType` (which is `ENTITY_TYPES.SWORD`) is the single source of truth for the type.

---

## 4. Systems Integration & Responsibilities

| System / Builder | Responsibility under "Weapons as Entities" |
| :--- | :--- |
| **`EntityManager`** | Loads player/weapon assets. Builds player entity, registers it. Then builds and registers the weapon entity, linking it via `ownerEntityId`. Handles clean destruction of both sprites. |
| **`PlayerBuilder`** | Instantiates character Matter sprite, mounts player components (e.g. `equipment`), and returns the `PlayerEntity`. |
| **`WeaponBuilder`** | Instantiates weapon Phaser sprite, mounts the components (`DamageComponent`, `AnimationComponent`), and returns the `WeaponEntity`. |
| **`CombatSystem`** | Matches players and weapons using `ownerEntityId`. Checks if the player is in an attack state; toggles weapon visibility/animations, and calculates weapon offsets based on the owner player's state. |
| **`AnimationSystem`** | Standardized system that registers animations for all entities (players and weapons alike) and plays the target key when `state.current` changes. |
