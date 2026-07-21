# State Component Documentation

## Overview

The `StateComponent` tracks an entity's current gameplay state (e.g., idle, moving, jumping). It serves as the source of truth for state-dependent systems like animation and physics.

---

## Technical Identity

- **Type:** Component
- **Domain:** State Management

---

## Responsibilities

- Maintains current state string
- Provides state context to dependent systems

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** `StateComponent`

### Configuration Props

- `current`: Active state identifier

---

## Lifecycle & Execution Flow

1. **Initialization:** Created with default state
2. **Update:** Modified by `StateSystem` based on game logic
3. **Teardown:** Removed with entity

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Systems:**
  - `StateSystem`: Manages state transitions
  - `AnimationSystem`: Reacts to state changes
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

N/A
