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
- **Writes:** `MovementComponent`

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
- Sets `intent.moveX` and `intent.moveY` to `0`
- Maps air speed/friction values from constants
- Maps ground speed/friction values from constants

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
