# Gun Weapon Handler Documentation

## Overview

The `GunWeaponHandler` is responsible for loading and building gun weapon entities. It handles the creation of bullet sprites and their associated ECS components.

---

## Technical Identity

- **Type:** Handler
- **Domain:** Weapon Building

---

## Responsibilities

- Loads bullet sprite assets
- Creates gun entity with proper ECS components
- Configures Matter.js physics body for bullets

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `load` Prop:
  - `scene`: Phaser.Scene instance
- `build` Prop:
  - `scene`: Phaser.Scene instance
  - `x`: Initial x position
  - `y`: Initial y position
  - `ownerEntityId`: ID of owning entity

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A
2. **Update Loop:** N/A
3. **Teardown:** N/A

---

## Methods

### `load({ scene }: { scene: Phaser.Scene }): void`

**Description:** Preloads bullet sprite assets

**Flow:**

1. Checks if textures already exist
2. Loads bullet sprites if not already loaded

**Side Effects:**

- Adds assets to Phaser's texture manager

### `build({ scene, ownerEntityId }: { scene: Phaser.Scene; x: number; y: number; ownerEntityId: string }): GlobalEntity`

**Description:** Creates a gun entity with components

**Flow:**

1. Creates Matter.js sprite at (-9999, -9999) (offscreen)
2. Configures sprite properties (size, origin, body)
3. Sets initial state and components
4. Configures as sensor with no gravity

**Side Effects:**

- Creates new entity in ECS
- Adds Matter.js physics body

---

## Dependencies & Relationships

- **Core Dependencies:** 
  - `Phaser.Scene`
  - `Phaser.Physics.Matter.Sprite`
  - `ENTITY_TYPES`, `BULLET`, `DEPTH`, `GUN_STATE` constants
- **Related Systems:** N/A
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Ensure textures are only loaded once to prevent duplicate assets
