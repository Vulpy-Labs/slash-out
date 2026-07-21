# Keymap Component Documentation

## Overview

The `KeymapComponent` stores input bindings and their corresponding keyboard listeners for player controls. It acts as the interface between physical input events and game actions.

---

## Technical Identity

- **Type:** Component
- **Domain:** Input

---

## Responsibilities

- Maintains mapping of game actions to key codes
- Tracks active keyboard listeners for input detection
- Provides reference for input systems to check key states

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `codes`: Maps `PossibleActions` to key strings
- `listeners`: Tracks active Key objects for each action

---

## Lifecycle & Execution Flow

1. **Initialization:** Created by `PlayerBuilder` with default key bindings
2. **Setup:** Phaser listeners registered by `KeymapSystem`
3. **Teardown:** Cleaned up when entity is destroyed

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** `POSSIBLE_ACTIONS`, `PossibleActions`
- **Related Systems:**
  - `KeymapSystem`: Manages listener registration
  - `InputSystem`: Reads key states
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Type Safety:** Always use `PossibleActions` type when accessing codes/listeners
