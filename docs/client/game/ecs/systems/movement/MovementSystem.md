# Movement System Documentation

## Overview

The `MovementSystem` translates input states into movement intent vectors for physics processing.

---

## Technical Identity

- **Type:** System
- **Domain:** Physics

---

## Responsibilities

- Converts button presses to directional vectors
- Handles basic movement intent calculations
- Prepares data for physics engine

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `InputComponent`: Provides action states for state transitions
- **Writes:**
  - `MovementComponent`: Intent vectors (moveX, moveY)

### Configuration Props

- `MovementSystemUpdateProp` (`*.p.ts`): Takes entities map for processing

---

## Lifecycle & Execution Flow

1. **Update Loop:** Processes movement intent each frame
2. **Teardown:** N/A

---

## Methods

### `update({ entities }: MovementSystemUpdateProp): void`

**Description:** Generates movement intent vectors from input

**Flow:**

- For each entity:
  - Resets previous intent
  - Sets X intent (normalized to [-1, 0, 1]):
    - -1 if `input.left`
    - 1 if `input.right`
    - 0 otherwise (no input)
  - Sets Y intent (normalized to [-1, 0]):
    - -1 if `input.jump`
    - Not set otherwise (retains physics gravity)
- Skipped if:
  - No `InputComponent` present
  - No `MovementComponent` present

**Side Effects:**

- Modifies movement intent
- Does NOT apply physics directly

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Systems:**
  - `InputSystem`: Provides processed inputs
  - `VelocitySystem`: Consumes intent vectors
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!NOTE]
>
> **Physics:** Does not apply physics forces directly - outputs intent only  
> **Performance:** Runs in update loop with lightweight integer math only (O(n))
