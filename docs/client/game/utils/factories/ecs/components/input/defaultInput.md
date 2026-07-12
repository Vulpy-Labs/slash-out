# Default Input Documentation

## Overview

The `defaultInput` factory creates an `InputComponent` with all possible actions initialized as inactive.

---

## Technical Identity

- **Type:** Factory
- **Domain:** Input

---

## Responsibilities

- Creates the baseline input state for entities
- Ensures every action in `POSSIBLE_ACTIONS` exists in the component
- Initializes all actions with `false`

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** `InputComponent`

### Configuration Props

- `POSSIBLE_ACTIONS`: list of action keys used to build the input map

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (Stateless)
2. **Update Loop:** Called during entity/component assembly
3. **Teardown:** N/A (Stateless)

---

## Methods

### `defaultInput(): InputComponent`

**Description:** Generates an input component with all supported actions disabled by default

**Flow:**

- Iterates over `POSSIBLE_ACTIONS`
- Assigns `false` for each action key
- Returns the constructed `InputComponent`

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `POSSIBLE_ACTIONS`
  - `InputComponent`
- **Related Systems:**
  - `InputSystem`: reads and updates action flags
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

N/A
