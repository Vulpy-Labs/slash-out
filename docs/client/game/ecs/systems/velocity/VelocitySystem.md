# Velocity System Documentation

## Overview

The `VelocitySystem` applies movement intentions to physics bodies and handles sprite flipping.

---

## Technical Identity

- **Type:** System
- **Domain:** Physics

---

## Responsibilities

- Translates movement intent into physics velocities
- Manages sprite direction flipping
- Interfaces with MatterJS physics

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `MovementComponent`: Accesses intent vectors and speed values
- **Writes:**
  - `AnimationComponent`: Sets `flipX` based on movement direction
  - `Phaser.Physics.Matter.Sprite`: Sets `sprite.body.velocity` via MatterJS

### Configuration Props

- `VelocitySystemProp` (`*.p.ts`): Requires Phaser Scene
- `VelocitySystemUpdateProp` (`*.p.ts`): Takes entities map

---

## Lifecycle & Execution Flow

1. **Initialization:** Stores scene reference
2. **Update Loop:** Applies velocities each frame
3. **Teardown:** N/A (Phaser manages physics)

---

## Methods

### `update({ entities }: VelocitySystemUpdateProp): void`

**Description:** Applies movement physics and flipping

**Flow:**

- For each entity:
  - Calculates X velocity from movement intent and ground speed
  - Calculates Y velocity from movement intent and air speed (if `moveY` exists)
  - Sets sprite flip state based on movement direction
  - Applies velocities via MatterJS
- Skipped if:
  - No `MovementComponent` present
  - No `Sprite.Body` present

**Side Effects:**

- Modifies physical body velocities
- Changes sprite rendering direction

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Physics.Matter.Sprite`, `MatterJS.BodyType`
- **Related Systems:**
  - `MovementSystem`: Consumes intent vectors
  - `AnimationSystem`: Reacts to flip states
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

N/A
