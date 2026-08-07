# GunWeaponSystemHandler Documentation

## Overview

The `GunWeaponSystemHandler` manages the firing and flight behavior of gun entities, including bullet positioning and movement.

---

## Technical Identity

- **Type:** Handler
- **Domain:** Weapon Behavior

---

## Responsibilities

- Handles bullet firing logic
- Manages bullet positioning relative to owner
- Controls bullet movement during flight
- Updates bullet state transitions

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `StateComponent`: Checks current gun state
  - `InputComponent`: Determines firing direction
  - `AnimationComponent`: Checks owner flip state
- **Writes:**
  - `MovementComponent`: Sets bullet movement intent
  - `Phaser.Physics.Matter.Sprite`: Updates position and visibility

### Configuration Props

- `GunWeaponSystemHandlerUpdateProp` (`*.p.ts`): Takes entity and entities map

---

## Lifecycle & Execution Flow

1. **Initialization:** Creates transform target object
2. **Update Loop:** Processes firing and flight each frame
3. **Teardown:** N/A

---

## Methods

### `update({ entity, entities }: GunWeaponSystemHandlerUpdateProp): void`

**Description:** Handles gun weapon system updates

**Flow:**
- Validates gun entity
- Processes firing state
- Updates bullet position and movement
- Transitions to flight state

**Side Effects:**
- Modifies sprite position and visibility
- Changes movement intent
- Updates entity state

---

### `fireBullet({ entity, entities }): void`

**Description:** Handles bullet firing logic

**Flow:**
- Gets owner entity
- Calculates bullet position based on owner state
- Sets bullet sprite properties
- Updates movement intent
- Transitions to flight state

**Side Effects:**
- Modifies sprite position and visibility
- Changes movement intent
- Updates entity state

---

### `populateFireTransform({ ownerState, ownerInput, isFlipped }): void`

**Description:** Calculates bullet firing transform

**Flow:**
- Determines firing direction based on owner state
- Sets position offset and angle
- Sets movement intent

**Side Effects:**
- Modifies internal transform target object

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Physics.Matter.Sprite`, `MatterJS.BodyType`
- **Related Systems:**
  - `WeaponSystem`: Manages weapon behavior
  - `VelocitySystem`: Applies movement intent
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Transform Target:** The internal transform target object is reused across frames to avoid allocations
