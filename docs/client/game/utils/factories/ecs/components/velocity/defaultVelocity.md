# Default Velocity Documentation

## Overview

The `defaultVelocity` factory creates a `VelocityComponent` with neutral initial velocity values.

---

## Technical Identity

- **Type:** Factory
- **Domain:** Physics

---

## Responsibilities

- Creates the baseline velocity state for entities
- Initializes horizontal and vertical velocity as zero
- Standardizes velocity bootstrap across entity creation

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** `VelocityComponent`

### Configuration Props

- N/A

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (Stateless)
2. **Update Loop:** Called during entity/component assembly
3. **Teardown:** N/A (Stateless)

---

## Methods

### `defaultVelocity(): VelocityComponent`

**Description:** Returns a velocity component with zeroed axes

**Flow:**

- Sets `vx` to `0`
- Sets `vy` to `0`
- Returns the `VelocityComponent`

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `VelocityComponent`
- **Related Systems:**
  - `VelocitySystem`: updates velocity values from movement and physics logic
  - `MovementSystem`: indirectly influences target velocity
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

N/A
