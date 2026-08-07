# GunWeaponHandler Documentation

## Overview

The `GunWeaponHandler` implements `IWeaponHandler` to create and manage gun weapon entities with bullet sprites and physics properties.

---

## Technical Identity

- **Type:** Handler
- **Domain:** Weapon Construction

---

## Responsibilities

- Loads bullet sprite assets
- Constructs gun entities with Matter.js physics
- Configures bullet sprite properties
- Manages gun state initialization

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:**
  - `StateComponent`: Initializes gun state
  - `InputComponent`: Provides default input mapping
  - `KeymapComponent`: Configures player-specific controls

### Configuration Props

- `{ scene: Phaser.Scene }`: For sprite loading
- `{ scene: Phaser.Scene, x: number, y: number, ownerEntityId: string }`: For entity construction

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Loads bullet sprites via `load()`
2. **Main Operations:**
   - Creates gun entity via `build()`
   - Configures sprite physics properties
   - Initializes state and input components
3. **Teardown:** N/A (Managed by EntityManager)

---

## Methods

### `load({ scene }: { scene: Phaser.Scene }): void`

**Description:** Preloads bullet sprite assets

**Flow:**
- Checks if textures exist
- Loads bullet sprites if not already loaded

**Side Effects:**
- Adds sprite assets to Phaser loader

---

### `build({ scene, x, y, ownerEntityId }): GlobalEntity`

**Description:** Constructs a gun weapon entity

**Flow:**
- Creates Matter.js sprite
- Configures sprite dimensions and physics
- Sets initial state and input components
- Determines player reference from owner ID

**Side Effects:**
- Creates new Matter.js body
- Initializes entity components

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Physics.Matter.Sprite`
  - `BULLET.CONFIG`
  - `DEPTH.ENTITIES`
  - `ENTITY_TYPES`
  - `GUN_STATE`
- **Related Systems:**
  - `WeaponBuilder`: Uses this handler for gun creation
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Physics:** Ensure `setSensor(true)` and `setIgnoreGravity(true)` remain set for proper bullet behavior
