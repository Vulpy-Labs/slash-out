# Animation System Documentation

## Overview

The `AnimationSystem` manages sprite animations and state transitions, interfacing with Phaser's animation system.

---

## Technical Identity

- **Type:** System
- **Domain:** Animation

---

## Responsibilities

- Creates Phaser animation definitions
- Plays animations based on entity state
- Handles sprite flipping and animation transitions
- Maintains unidirectional ECS flow (State -> Animation)
- Enforces visual abstraction through builders

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `AnimationComponent`: Accesses animation configurations and flip state
  - `StateComponent`: Determines current animation state
  - `Phaser.Physics.Matter.Sprite`: Checks current animation playback status
- **Writes:**
  - `Phaser.Physics.Matter.Sprite`: Plays animations and sets `flipX`
  - `AnimationComponent`: Updates `flipX` state

### Configuration Props

- `AnimationSystemProp` (`*.p.ts`): Requires Phaser Scene
- `AnimationSystemPayloadProp` (`*.p.ts`): Takes GlobalEntityMap
- `GlobalEntityMap`: Type for entities collection

---

## Lifecycle & Execution Flow

1. **Initialization:** Stores scene reference
2. **Create:** Builds animation definitions
3. **Update Loop:** Manages animation playback
4. **Teardown:** None (Phaser manages animations)

---

## Methods

### `create({ entities }: AnimationSystemPayloadProp): void`

**Description:** Registers animations with Phaser

**Flow:**

- Validates animation key exist
- Confirms frame dimensions match texture atlas
- Creates frame sequences
- Registers animations with Phaser

### `update({ entities }: AnimationSystemPayloadProp): void`

**Description:** Plays appropriate animations

**Flow:**

- For each entity:
  - Sets sprite flip state if `animation.flipX` is defined
  - Determines target animation:
    - Uses `state.current` if `StateComponent` exists
    - Falls back to first animation otherwise
  - Checks sprite's current animation
  - Plays new animation if not already active
- Skipped if:
  - No `AnimationComponent` present
  - No `Sprite` present

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Animations`
- **Related Systems:**
  - `StateSystem`: Provides state changes
  - `VelocitySystem`: Provides flip state
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]
>
> **Preloading:** Must verify `scene.textures.exists(key)` before `create()` execution  
> **Timing:** Run `create()` only after texture preloading completes  
> **Memory:** Creates ~25KB per animation (frames multiplied by resolution)  
> **Optimization:** Caches animation state checks to minimize per-frame work
