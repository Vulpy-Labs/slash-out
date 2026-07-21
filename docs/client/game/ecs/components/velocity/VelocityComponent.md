# Velocity Component Documentation

## Overview

The `VelocityComponent` stores an entity's current movement velocity in 2D space. It serves as the output of movement calculations and input for physics systems.

---

## Technical Identity

- **Type:** Component
- **Domain:** Physics

---

## Responsibilities

- Tracks current velocity on X/Y axes
- Provides movement state to physics systems

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `vx`: Horizontal velocity
- `vy`: Vertical velocity

---

## Lifecycle & Execution Flow

1. **Initialization:** Created with zero velocity
2. **Update:** Calculated by `VelocitySystem`
3. **Teardown:** Removed with entity

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** N/A
- **Related Systems:**
  - `VelocitySystem`: Updates values
  - `MovementSystem`: Provides input
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

N/A
