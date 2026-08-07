# GunWeaponSystemHandler Documentation

## Overview

The `GunWeaponSystemHandler` manages the visual representation and positioning of gun entities during firing states.

---

## Technical Identity

- **Type:** Handler
- **Domain:** Weapon System

---

## Responsibilities

- Positions gun sprite relative to owner
- Manages gun visibility
- Handles sprite transformations

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `StateComponent`: Checks current state
  - `Sprite`: Accesses sprite properties
- **Writes:**
  - `Sprite`: Updates position, visibility, and depth

### Configuration Props

- `GunWeaponSystemHandlerUpdateProp` (`*.p.ts`): Contains entity and optional entities map

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A
2. **Update Loop:**
   - Validates entity
   - Positions gun if firing
   - Hides gun if not firing
3. **Teardown:** N/A

---

## Methods

### `update({ entity, entities }: GunWeaponSystemHandlerUpdateProp): void`

**Description:** Main update method for gun positioning

**Flow:**

1. Validates entity
2. Shows and positions gun if firing
3. Hides gun if not firing

**Side Effects:**

- Modifies sprite properties

### `private isValidGun(entity: GlobalEntity): entity is ValidGunWeaponEntity`

**Description:** Type guard for valid gun entities

**Flow:**

1. Checks entity has required components
2. Verifies entity type is GUN

**Side Effects:** N/A

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `ENTITY_TYPES`, `GUN_STATE`, `DEPTH`, `BULLET` constants
  - `Phaser.Physics.Matter.Sprite`
- **Related Systems:**
  - `WeaponSystem`: Receives updates from this handler
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** 
> - Runs in update loop
> - Reuses transform target object to avoid allocations
> - Keep transformations efficient
