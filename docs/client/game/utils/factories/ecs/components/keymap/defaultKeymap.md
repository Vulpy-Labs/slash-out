# Default Keymap Documentation

## Overview

The `defaultKeymap` factory builds a `KeymapComponent` using predefined keyboard layouts for each player slot.

---

## Technical Identity

- **Type:** Factory
- **Domain:** Input

---

## Responsibilities

- Creates keyboard code mappings for player 1 and player 2
- Initializes key listener slots for all possible actions
- Provides a single selector entry point based on player id

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** `KeymapComponent`

### Configuration Props

- `player: '01' | '02'`: chooses the keymap preset
- `POSSIBLE_ACTIONS`: drives listener key initialization

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (Stateless)
2. **Update Loop:** Called during entity/component assembly
3. **Teardown:** N/A (Stateless)

---

## Methods

### `defaultKeymap({ player }: DefaultKeymapProp): KeymapComponent`

**Description:** Selects and returns the keymap preset for the requested player

**Flow:**

- Checks `player`
- Returns `defaultKeymapP2()` when player is `02`
- Returns `defaultKeymapP1()` for any other valid case

### `defaultKeymapP1(): KeymapComponent`

**Description:** Builds player 1 key bindings (WASD + IJKL)

### `defaultKeymapP2(): KeymapComponent`

**Description:** Builds player 2 key bindings (arrows + numpad)

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `POSSIBLE_ACTIONS`
  - `PossibleActions`
  - `KeymapComponent`
  - `DefaultKeymapProp`
- **Related Systems:**
  - `KeymapSystem`: consumes key codes and listener references
  - `InputSystem`: receives action signals from key listeners
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Input Parity:** When adding/removing actions in `POSSIBLE_ACTIONS`, update key codes and listener initialization together to keep keymap/input compatibility.
