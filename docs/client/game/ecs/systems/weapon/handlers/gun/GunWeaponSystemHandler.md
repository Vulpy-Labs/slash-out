# Gun Weapon System Handler Documentation

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

### `private showAndPositionGun({ entity, entities }): void`

**Description:** Handles visible gun state

**Flow:**
1. Checks if sprite is already visible
2. Makes sprite visible if not
3. Sets proper depth
4. Finds owner entity
5. Calculates position relative to owner

**Side Effects:**
- Modifies sprite visibility and position
- Updates sprite depth

### `private updateTransform({ gun, owner }): void`

**Description:** Calculates and applies gun positioning

**Flow:**
1. Checks owner flip state
2. Calculates offsets based on attack direction (up/down/neutral)
3. Adjusts angle for vertical attacks (90° up/down)
4. Maintains horizontal offset for neutral attacks
5. Applies final position, angle and flip to sprite

**Side Effects:**
- Updates sprite transform properties

### `private populateOffsetAndAngle({ ownerState, ownerInput, isFlipped }): void`

**Description:** Determines gun positioning offsets

**Flow:**
1. Checks for up/down attack inputs
2. Calculates appropriate offsets and angles:
   - 90° up/down for vertical attacks
   - 0° for horizontal attacks
   - Offset determined by BULLET.CONFIG.OFFSET
3. Stores results in transform target

**Side Effects:**
- Updates internal transform target object

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
  - `BULLET.CONFIG.OFFSET`: Determines vertical/horizontal positioning offset
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
