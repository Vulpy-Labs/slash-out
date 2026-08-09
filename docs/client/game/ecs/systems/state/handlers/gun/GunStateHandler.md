# GunStateHandler Documentation

## Overview

Handles state transitions for gun entities, managing firing states and attack spamming prevention.

---

## Technical Identity

- **Type:** Handler
- **Domain:** State Management

---

## Responsibilities

- Manages gun firing state transitions
- Prevents attack spamming
- Validates gun entities before processing

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `InputComponent`: Checks gun input state
  - `StateComponent`: Reads current state and spamming flag
- **Writes:**
  - `StateComponent`: Updates current state and spamming flag

### Configuration Props

- `GunStateHandlerUpdateProp`: Contains entity to process

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (stateless handler)
2. **Update Loop:** Processes state changes each frame
3. **Teardown:** N/A

---

## Methods

### `update({ entity }: GunStateHandlerUpdateProp): void`

**Description:** Main update method for gun state handling

**Flow:**
- Validates entity type
- Updates attack lock state
- Resolves gun state based on input

**Side Effects:**
- Modifies entity's state component

### `private updateAttackLockState({ state, input }: { state: StateComponent; input: InputComponent }): void`

**Description:** Manages attack spamming state

**Flow:**
- Clears spamming flag when gun input is released

### `private resolveGunState({ state, input }: { state: StateComponent; input: InputComponent }): void`

**Description:** Determines new gun state

**Flow:**
- Checks if gun input is active (`input.gun`)
- Checks if not currently spamming (`!state.isAttackSpamming`)
- If both conditions true:
  - Sets state to `GUN_STATE.FIRING`
  - Sets `isAttackSpamming` flag to true

### `private isValidGun(entity: GlobalEntity): entity is ValidGunEntity`

**Description:** Type guard for valid gun entities

**Flow:**
- Checks for required components
- Verifies entity type is GUN

---

## Dependencies & Relationships

- **Core Dependencies:** 
  - `ENTITY_TYPES`
  - `GUN_STATE`
- **Related Systems:**
  - `StateSystem`: Registers and calls this handler
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Validation:** Silently skips invalid entities  
> **State Transition:** Only handles FIRING state transitions  
