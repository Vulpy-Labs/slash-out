# Gun State Handler Documentation

## Overview

The `GunStateHandler` manages state transitions for gun entities, handling firing states and attack cooldowns.

---

## Technical Identity

- **Type:** Handler
- **Domain:** State Management

---

## Responsibilities

- Manages gun state transitions
- Handles attack cooldown timers
- Prevents attack spamming

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `StateComponent`: Checks current state and ticker
  - `InputComponent`: Evaluates gun input
- **Writes:**
  - `StateComponent`: Updates current state and ticker

### Configuration Props

- `GunStateHandlerUpdateProp` (`*.p.ts`): Contains the entity to be processed

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A
2. **Update Loop:**
   - Validates entity
   - Processes state transitions
   - Updates attack cooldown
3. **Teardown:** N/A

---

## Methods

### `update({ entity }: GunStateHandlerUpdateProp): void`

**Description:** Main update method for gun state transitions

**Flow:**

1. Validates entity
2. Processes ticker if active
3. Resets expired attack state
4. Updates attack lock state
5. Resolves gun state based on input

**Side Effects:**

- Modifies `StateComponent` values

### `private isValidGun(entity: GlobalEntity): entity is ValidGunEntity`

**Description:** Type guard for valid gun entities

**Flow:**

1. Checks entity has required components
2. Verifies entity type is GUN

**Side Effects:** N/A

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `ENTITY_TYPES`, `GUN_STATE`, `BULLET` constants
  - `BULLET.ATTACK.DURATION_TICKS`: Determines firing cooldown duration
  - `isTickerActive`, `decrementStateTicker` utilities
- **Related Systems:**
  - `StateSystem`: Receives state updates from this handler
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Runs in update loop. Keep state checks lightweight.
