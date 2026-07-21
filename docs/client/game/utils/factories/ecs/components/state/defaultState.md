# Default State Documentation

## Overview

The `defaultState` factory creates a `StateComponent` initialized with the default logical character state.

---

## Technical Identity

- **Type:** Factory
- **Domain:** State Management

---

## Responsibilities

- Creates the initial state payload for entities
- Sets a stable default state for state-machine bootstrap
- Standardizes state initialization across entity creation flows

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** `StateComponent`

### Configuration Props

- `CHARACTER_STATE.IDLE`: default value for `current`

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (Stateless)
2. **Update Loop:** Called during entity/component assembly
3. **Teardown:** N/A (Stateless)

---

## Methods

### `defaultState(): StateComponent`

**Description:** Returns the initial state component with `current` set to idle

**Flow:**

- Reads `CHARACTER_STATE.IDLE`
- Returns a `StateComponent` object with `current`

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `CHARACTER_STATE`
  - `StateComponent`
- **Related Systems:**
  - `StateSystem`: updates and transitions character state
  - `AnimationSystem`: maps visual output from current state
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

N/A
