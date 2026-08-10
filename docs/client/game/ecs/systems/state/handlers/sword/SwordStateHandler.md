# SwordStateHandler Documentation

## Overview

Handles state transitions for sword entities based on input.

---

## Technical Identity

- **Type:** Handler
- **Domain:** State Management

---

## Responsibilities

- Manages sword state transitions between IDLE and SLASHING
- Validates sword entities before processing

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `InputComponent`: Checks sword input state
- **Writes:**
  - `StateComponent`: Updates current sword state

### Constants Used

- `SWORD_STATE`: Defines possible sword states (IDLE, SLASHING)
- `ENTITY_TYPES`: Identifies sword entities

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (stateless handler)
2. **Update Loop:** Processes sword state transitions each frame
3. **Teardown:** N/A

---

## Methods

### `update({ entity }: SwordStateHandlerUpdateProp): void`

**Description:** Updates sword state based on input

**Flow:**
- Validates entity is a sword
- Checks sword input state
- Updates state to SLASHING if input active
- Returns to IDLE state otherwise

**Side Effects:**
- Modifies entity's StateComponent

### `private isValidSword(entity: GlobalEntity): entity is ValidSwordEntity`

**Description:** Type guard for sword entities

**Flow:**
- Checks entity has required components
- Verifies entity type is SWORD

**Side Effects:** N/A

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Systems:**
  - `StateSystem`: Registers and calls handler
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]
> **Validation:** Entities without required components will be skipped
