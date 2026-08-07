# GunStateHandler Documentation

## Overview

The `GunStateHandler` manages state transitions for gun entities, including firing cooldowns and attack spamming prevention.

---

## Technical Identity

- **Type:** Handler
- **Domain:** State Management

---

## Responsibilities

- Handles gun state transitions
- Manages firing cooldowns
- Prevents attack spamming
- Delegates to owner input

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `StateComponent`: Checks current state and ticker
  - `InputComponent`: Checks gun input from owner
- **Writes:**
  - `StateComponent`: Updates current state and ticker

### Configuration Props

- `GunStateHandlerUpdateProp` (`*.p.ts`): Takes entity and entities map

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A
2. **Update Loop:** Processes state transitions each frame
3. **Teardown:** N/A

---

## Methods

### `update({ entity, entities }: GunStateHandlerUpdateProp): void`

**Description:** Handles gun state updates

**Flow:**
- Validates gun entity
- Processes active ticker
- Resolves attack spamming
- Updates gun state based on input

**Side Effects:**
- Modifies state component
- Updates ticker value

---

### `resolveAttackSpamming({ state, input }): void`

**Description:** Manages attack spamming prevention

**Flow:**
- Resets spamming flag if no input
- Maintains spamming flag during input

**Side Effects:**
- Modifies state component

---

### `resolveGunState({ state, input }): void`

**Description:** Handles state transitions

**Flow:**
- Transitions to firing state on input
- Returns to idle state when not in flight
- Sets firing duration ticker

**Side Effects:**
- Modifies state component
- Updates ticker value

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Systems:**
  - `StateSystem`: Manages state transitions
  - `WeaponSystem`: Handles weapon behavior
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Ticker Management:** Ensure ticker values are properly decremented to prevent state lock
