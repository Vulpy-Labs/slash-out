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
- Initializes gun in hidden state (-9999, -9999 position)
- Sets ignoreGravity for bullet physics

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
  - `x`: Initial x position (unused; weapon is initialized off-screen at `(-9999, -9999)`)
  - `y`: Initial y position (unused; weapon is initialized off-screen at `(-9999, -9999)`)
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

**Description:** Creates a gun entity with components initialized off-screen at `(-9999, -9999)` (`x` and `y` parameters are part of `IWeaponHandler` contract but unused)

**Flow:**

1. Creates Matter.js sprite at (-9999, -9999) (offscreen)
2. Configures sprite properties (size, origin, body)
3. Sets initial state and components
4. Applies physics configuration (`setIgnoreGravity(true)`, `setVisible(false)`, depth)

**Side Effects:**

- Creates new entity in ECS
- Adds Matter.js physics body

---

## Dependencies & Relationships

- **Core Dependencies:** 
  - `Phaser.Scene`: Scene context
  - `Phaser.Physics.Matter.Sprite`: Physics sprite implementation
  - `ENTITY_TYPES`: Entity type constants
  - `BULLET`: Bullet configuration constants
  - `DEPTH`: Rendering depth constants
  - `GUN_STATE`: Gun state constants
- **Related Systems:** N/A
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Ensure textures are only loaded once to prevent duplicate assets
