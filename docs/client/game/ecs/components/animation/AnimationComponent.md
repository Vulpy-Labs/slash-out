# Animation Component Documentation

## Overview

The `AnimationComponent` stores animation configurations and state for entities. It drives visual feedback based on gameplay state through Phaser's animation system.

---

## Technical Identity

- **Type:** Component
- **Domain:** Animation

---

## Responsibilities

- Maintains animation definitions keyed by entity state
- Tracks flip state for sprite rendering
- Provides animation data to `AnimationSystem`

---

## Data Schema

### Manipulated Components

- **Reads:** `StateComponent`
- **Writes:** N/A

### Configuration Props

- `flipX`: Horizontal flip state
- `animations`: Animation configurations per entity state

---

## Lifecycle & Execution Flow

1. **Initialization:** Created by `PlayerBuilder` with default animations
2. **Update:** `AnimationSystem` picks animation based on state
3. **Teardown:** Removed with entity

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** 
  - `CHARACTER_STATE`
  - `SWORD_STATE`
- **Related Systems:**
  - `AnimationSystem`: Handles playback
  - `StateSystem`: Triggers state changes
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!NOTE]  
> **Performance:** Ensure animation keys match texture atlas frames exactly
