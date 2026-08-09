# SwordWeaponHandler Documentation

## Overview

Factory handler responsible for creating and configuring sword weapon entities. Loads sword assets and constructs sword entities with proper physics and rendering properties.

---

## Technical Identity

- **Type:** Builder Handler  
- **Domain:** Weapon/Entity Creation  

---

## Responsibilities

- Preloads sword sprite assets
- Constructs sword entities with Matter.js physics
- Configures sword sprite properties
- Sets up default components for sword entities

---

## Data Schema

### Manipulated Components

- **Reads:** N/A (Builder pattern)
- **Writes:**
  - `Sprite`: Creates and configures Matter sprite
  - `StateComponent`: Initializes sword state
  - `InputComponent`: Sets default input
  - `KeymapComponent`: Configures key bindings
  - `AnimationComponent`: Sets default animations

### Configuration Props

- `SWORD.CONFIG`: Defines sword dimensions and origin
- `DEPTH.ENTITIES`: Sets initial sprite depth

---

## Lifecycle & Execution Flow

1. **Loading:**
   - Checks and loads sword sprite assets
2. **Building:**
   - Creates Matter.js sprite
   - Configures physics body
   - Sets initial properties
   - Returns complete entity

---

## Methods

### `load({ scene }: { scene: Phaser.Scene }): void`

**Description:** Preloads sword sprite assets

**Flow:**
- Checks if textures exist
- Loads missing sword sprites

**Side Effects:**
- Adds assets to Phaser loader

### `build({ scene, ownerEntityId }): GlobalEntity`

**Description:** Constructs sword entity

**Flow:**
- Creates Matter sprite
- Configures display and physics
- Sets initial components
- Returns complete entity

**Side Effects:**
- Creates new entity instance
- Initializes physics body

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Physics.Matter.Sprite`
  - `SWORD.CONFIG` constants
- **Related Systems:**
  - `EntityManager`: Registers created entities
  - `WeaponSystem`: Manages weapon behavior

---

## Maintenance Notes

> [!WARNING]  
> **Asset Loading:** Always check `textures.exists()` before loading
> **Physics:** Sensor bodies don't trigger collisions
