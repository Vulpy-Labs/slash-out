# Get Mobility Documentation

## Overview

The `getMobility` determines the mobility state (grounded/airborne) of a Matter.js physics sprite based on its vertical velocity.

---

## Technical Identity

- **Type:** Utility
- **Domain:** Physics

---

## Responsibilities

- Determines if a physics sprite is grounded or airborne
- Provides mobility state for state transition logic

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `Phaser.Physics.Matter.Sprite`: Accesses velocity data
- **Writes:** N/A

### Configuration Props

- `PLAYER_MOVEMENT.GROUND.GROUNDED_VELOCITY_THRESHOLD`: Threshold for grounded state

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (Stateless)
2. **Update Loop:** Called as needed by dependent systems
3. **Teardown:** N/A (Stateless)

---

## Methods

### `getMobility(sprite: Phaser.Physics.Matter.Sprite): Mobility`

**Description:** Determines mobility state from sprite's vertical velocity

**Flow:**

- Gets MatterJS body from sprite
- Checks if absolute Y velocity is below grounded threshold
- Returns `MOBILITY.GROUNDED` or `MOBILITY.AIRBORNE`

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Physics.Matter.Sprite`
  - `MatterJS.BodyType`
- **Related Systems:**
  - `StateSystem`: Uses mobility for state transitions
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** This utility is called frequently during the physics update loop. Keep calculations lightweight.
