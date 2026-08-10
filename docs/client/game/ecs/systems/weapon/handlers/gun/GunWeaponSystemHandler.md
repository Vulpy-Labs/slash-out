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
  - `MovementComponent`: Updates movement intent
- **Writes:**
  - `Sprite`: Updates position, visibility, depth and angle
  - `MovementComponent`: Sets movement intent

### Configuration Props

- `GunWeaponSystemHandlerUpdateProp` (`*.p.ts`): Contains entity and optional entities map

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A
2. **Update Loop:**
   - Validates entity
   - Fires bullet when state is `GUN_STATE.FIRING`
   - Hides and resets projectile when state is not `FIRING` and not `IN_FLIGHT`
3. **Teardown:** N/A

---

## Methods

### `update({ entity, entities }: GunWeaponSystemHandlerUpdateProp): void`

**Description:** Main update method for gun positioning and firing logic

**Flow:**

1. Validates entity
2. Calls `fireBullet({ entity, entities })` if current state is `GUN_STATE.FIRING`
3. Calls `hideAndResetGun({ entity })` if state is not `GUN_STATE.IN_FLIGHT`

**Side Effects:**

- Modifies sprite properties and movement intent

### `private fireBullet({ entity, entities }): void`

**Description:** Executes bullet firing sequence

**Flow:**

1. Obtains owner entity and flip state
2. Calls `populateFireTransform` to calculate transform offsets and movement intent
3. Sets sprite position, flipX, angle, depth, and visibility to `true`
4. Sets movement intent `moveX` and `moveY` on entity
5. Transitions current state to `GUN_STATE.IN_FLIGHT`

**Side Effects:**

- Modifies sprite position, angle, flip, visibility, and depth
- Sets movement intent
- Updates state to `GUN_STATE.IN_FLIGHT`

### `private populateFireTransform({ ownerState, ownerInput, isFlipped }): void`

**Description:** Determines gun positioning offsets, angles, and movement intent

**Flow:**

1. Checks owner attack states and up/down inputs
2. Calculates offsets (`BULLET.CONFIG.OFFSET`), angles (90°/-90° for vertical attacks, 0° for horizontal), and movement direction (`moveX`, `moveY`)
3. Stores parameters in `transformTarget` object

**Side Effects:**

- Updates internal `transformTarget` object

### `private hideAndResetGun({ entity }): void`

**Description:** Resets movement intent and hides projectile sprite off-screen

**Flow:**

1. Resets `movement.intent.moveX` and `moveY` to `0`
2. Sets sprite visibility to `false`
3. Resets sprite angle to `0`
4. Moves sprite off-screen to `(-9999, -9999)`

**Side Effects:**

- Resets movement intent
- Modifies sprite visibility, angle, depth, and position

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
