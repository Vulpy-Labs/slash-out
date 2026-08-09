# SwordWeaponHandler Documentation

## Overview

Handles loading and building sword weapon entities with Matter.js physics.

---

## Technical Identity

- **Type:** Handler  
- **Domain:** Weapon Construction

---

## Responsibilities

- Loads sword sprite assets
- Creates Matter.js physics sprites for swords
- Configures sword physics properties (sensor, gravity)
- Sets sword visual properties (origin, depth)

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A
- **Creates:**
  - `GlobalEntity` with sword configuration

### Constants Used

- `ENTITY_TYPES`: Defines weapon entity type ('SWORD')
- `DEPTH`: Controls entity rendering depth (ENTITIES layer)
- `SWORD.CONFIG`:
  - `WIDTH`: Physical body width
  - `HEIGHT`: Physical body height  
  - `ORIGIN_X`: Sprite origin X
  - `ORIGIN_Y`: Sprite origin Y
  - `OFFSET`: Position offset applied by `EntityManager.createPlayers` before `WeaponBuilder.build`

---

## Lifecycle & Execution Flow

1. **Loading:**
   - Loads 5 sword sprite variants (spr_sword_0 to spr_sword_4)
2. **Building:**
   - Creates Matter.js sprite
   - Configures physics body as sensor
   - Sets visual properties
   - Returns GlobalEntity

---

## Methods

### `load({ scene })`

**Description:** Preloads sword sprites

**Flow:**
- Checks if texture exists
- Loads if not present
- Handles 5 sprite variants

**Side Effects:**
- Adds assets to Phaser loader

### `build({ scene, x, y, ownerEntityId })`

**Description:** Creates sword entity

**Flow:**
- Creates Matter sprite
- Sets display size from config
- Configures origin
- Creates rectangle physics body
- Sets as sensor
- Disables gravity
- Sets depth

**Side Effects:**
- Adds sprite to Matter world
- Returns new GlobalEntity

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Physics.Matter.Sprite`
  - `SWORD.CONFIG` constants
- **Related Systems:**
  - `WeaponBuilder`: Creates handler instance
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Physics:** Sensor bodies trigger collision events but do not physically react to colliding bodies  
> **Memory:** Textures must be preloaded before building
