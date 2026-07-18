# Input Component Documentation

## Overview

The `InputComponent` tracks the current state of player inputs mapped to game actions. It acts as a buffer between raw input events and game systems that respond to those inputs.

---

## Technical Identity

- **Type:** Component
- **Domain:** Input

---

## Responsibilities

- Contains boolean states for all possible game actions
- Provides filtered input state for movement/action systems

---

## Data Schema

### Manipulated Components

- **Reads:** `KeymapComponent`
- **Writes:** N/A

### Configuration Props

- `PossibleActions` (type): Enumeration of controllable game actions

---

## Lifecycle & Execution Flow

1. **Initialization:** Created with default false states
2. **Update:** Refreshed each frame by `InputSystem`
3. **Teardown:** Removed with entity

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** `POSSIBLE_ACTIONS`, `PossibleActions`
- **Related Systems:**
  - `InputSystem`: Updates component state
  - `MovementSystem`: Consumes input states
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!NOTE]  
> **Performance:** Optimized as simple boolean flags for fast polling.
