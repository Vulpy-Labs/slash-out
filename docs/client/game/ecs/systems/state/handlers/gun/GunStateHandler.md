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
- Handles attack cooldown timers via state ticker
- Prevents attack spamming using `isAttackSpamming` flag
- Manages transition between states:
  - `IDLE` -> `FIRING` on input
  - `FIRING` -> `IN_FLIGHT` after duration
  - `IN_FLIGHT` -> `IDLE` when complete

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

### `private resetExpiredAttackState({ state }: { state: StateComponent }): void`

**Description:** Resets gun state to IDLE when firing state expires

**Flow:**
1. Checks if current state is FIRING
2. Resets to IDLE if true

**Side Effects:**
- Modifies StateComponent.current

### `private updateAttackLockState({ state, input }: { state: StateComponent; input: InputComponent }): void`

**Description:** Manages gun input lockout state

**Flow:**
1. Resets lock if no gun input
2. Sets lock if gun input detected

**Side Effects:**
- Modifies StateComponent.isAttackSpamming

### `private resolveGunState({ state, input }: { state: StateComponent; input: InputComponent }): void`

**Description:** Determines gun state based on input

**Flow:**
1. Checks for gun input
2. Sets FIRING state if input detected and not locked
3. Sets IDLE state otherwise

**Side Effects:**
- Modifies StateComponent.current
- Updates StateComponent.ticker

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
