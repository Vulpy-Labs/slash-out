# Default Movement Documentation

## Overview

The `defaultMovement` factory creates a `MovementComponent` with default intent values and movement parameters derived from the entity type mapping.

---

## Technical Identity

- **Type:** Factory
- **Domain:** Movement

---

## Responsibilities

- Builds a normalized `MovementComponent` payload for new entities
- Initializes movement intent with neutral values
- Resolves air and ground movement configuration from `MOVEMENT_MAPPING`

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** `MovementComponent`:
  - `intent`: 
    - `moveX: 0 | 1 | -1`
    - `moveY: 0 | 1 | -1`
  - `air`:
    - `speed: number`
    - `friction: number`
  - `ground`:
    - `speed: number`
    - `friction: number`

### Configuration Props

- `entityType: EntityTypes`: selects the movement profile in `MOVEMENT_MAPPING`

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (Stateless)
2. **Update Loop:** Called during entity/component assembly
3. **Teardown:** N/A (Stateless)

---

## Methods

### `defaultMovement({ entityType }: DefaultMovementProp): MovementComponent`

**Description:** Creates a movement component configured for the provided entity type

**Flow:**

- Reads the movement profile from `MOVEMENT_MAPPING[entityType]`
- Initializes `intent` with:
  - `moveX: 0`
  - `moveY: 0`
- Maps air movement values:
  - `speed` from `MOVEMENT_MAPPING[entityType].AIR.SPEED`
  - `friction` from `MOVEMENT_MAPPING[entityType].AIR.FRICTION`
- Maps ground movement values:
  - `speed` from `MOVEMENT_MAPPING[entityType].GROUND.SPEED`
  - `friction` from `MOVEMENT_MAPPING[entityType].GROUND.FRICTION`

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `MOVEMENT_MAPPING`
  - `MovementComponent`
  - `DefaultMovementProp`
- **Related Systems:**
  - `MovementSystem`: consumes movement intent and movement parameters
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Consistency:** Keep `MOVEMENT_MAPPING` synchronized with valid `EntityTypes` to avoid undefined movement profiles.
>
> **Type Safety:** Ensure `entityType` parameter matches the keys in `MOVEMENT_MAPPING` to prevent runtime errors.
