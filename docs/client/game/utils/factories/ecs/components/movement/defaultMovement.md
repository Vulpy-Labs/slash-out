# Default Movement Documentation

## Overview

The `defaultMovement` factory creates a `MovementComponent` with default intent values and movement parameters derived from the entity type mapping.

---

## Technical Identity

- **Type:** Component Factory
- **Domain:** Movement

---

## Responsibilities

- Builds a normalized `MovementComponent` payload for new entities
- Ensures consistent movement component initialization
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
2. **Execution:** Called during entity/component assembly to initialize movement parameters
3. **Teardown:** N/A (Stateless)

---

## Methods

### `defaultMovement({ entityType }: DefaultMovementProp): MovementComponent`

**Description:** Creates a movement component configured for the provided entity type

**Flow:**

- Validates entityType against MOVEMENT_MAPPING keys
- Reads the movement profile from `MOVEMENT_MAPPING[entityType]`
- Initializes `intent` with neutral values
- Maps air and ground movement values from configuration

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `MOVEMENT_MAPPING` configuration
  - `MovementComponent` interface
  - `DefaultMovementProp` type
- **Related Systems:**
  - `MovementSystem`: consumes movement intent and movement parameters
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Consistency:** Keep `MOVEMENT_MAPPING` synchronized with valid `EntityTypes` to avoid undefined movement profiles.
>
> **Type Safety:** Ensure `entityType` parameter matches the keys in `MOVEMENT_MAPPING` to prevent runtime errors.
> **Configuration:** Movement parameters are centralized in MOVEMENT_MAPPING for easy tuning
