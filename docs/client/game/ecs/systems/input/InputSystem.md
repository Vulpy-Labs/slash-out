# Input System Documentation

## Overview

The `InputSystem` processes raw keyboard input into normalized boolean action states, handling conflicting key combinations.

---

## Technical Identity

- **Type:** System
- **Domain:** Input

---

## Responsibilities

- Translates Phaser keyboard states to game actions
- Resolves conflicts between mutually exclusive actions
- Maintains input debounce timing

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `KeymapComponent`: Accesses keyboard listener states and timing
- **Writes:**
  - `InputComponent`: Processed boolean action states

### Configuration Props

- `InputSystemUpdateProp` (`*.p.ts`): Takes entities map for processing

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A
2. **Update Loop:** Processes input states each frame
3. **Teardown:** N/A

---

## Methods

### `update({ entities }: InputSystemUpdateProp): void`

**Description:** Updates input states from keyboard listeners

**Flow:**

- For each entity:
  - Copies raw keyboard states to input component
  - Applies conflict resolution rules
  - Resolves conflicts via temporal priority using Phaser's `timeDown`
  - Specifically compares `Key.timeDown` between conflicting inputs
  - When both conflicting keys are pressed:
    - Records which key was pressed first
    - Only the most recently pressed key remains active
    - Automatically clears the conflicting input state
- Skipped if:
  - No `KeymapComponent` present
  - No `InputComponent` present

**Side Effects:**

- Modifies input component state
- Processes temporal input conflicts

---

## Dependencies & Relationships

- **Core Dependencies:** `CONFLICTING_ACTIONS`, `PossibleActions`
- **Related Systems:**
  - `KeymapSystem`: Provides keyboard listeners
  - `MovementSystem`: Consumes processed inputs
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Extensibility:** Add new actions by extending PossibleActions and CONFLICTING_ACTIONS
