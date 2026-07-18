# Movement Component Documentation

## Overview

The `MovementComponent` stores movement physics parameters and directional intent for mobile entities. It serves as input for the `VelocitySystem` to calculate actual movement.

---

## Technical Identity

- **Type:** Component
- **Domain:** Physics

---

## Responsibilities

- Maintains friction/speed values for ground/air
- Tracks movement intent directions
- Provides parameters for velocity calculation

---

## Data Schema

### Manipulated Components

- **Reads:** `InputComponent`
- **Writes:** `VelocityComponent`

### Configuration Props

- `intent`: Desired X/Y movement direction
- `air`: Air movement parameters
- `ground`: Ground movement parameters

---

## Lifecycle & Execution Flow

1. **Initialization:** Created with default physics values
2. **Update:** Modified by `MovementSystem`
3. **Teardown:** Removed with entity

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Systems:**
  - `MovementSystem`: Updates intent
  - `VelocitySystem`: Applies physics
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Avoid runtime modifications to physics params
