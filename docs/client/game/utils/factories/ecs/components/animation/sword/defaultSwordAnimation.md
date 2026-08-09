# defaultSwordAnimation Documentation

## Overview

Factory function that creates default animation configurations for sword entities.

---

## Technical Identity

- **Type:** Factory
- **Domain:** Animation Configuration

---

## Responsibilities

- Defines idle and slashing animations for swords
- Provides animation frame sequences
- Configures animation properties (repeat, frame rate)

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A
- **Creates:**
  - `AnimationComponent` with sword animations

### Animation Properties

- `key`: Animation identifier
- `start`: Starting frame index
- `end`: Ending frame index
- `repeat`: Whether animation loops
- `frameRate`: Playback speed
- `frames`: Array of sprite frames

---

## Lifecycle & Execution Flow

1. **Initialization:** Called during sword entity creation
2. **Execution:** Returns preconfigured animation component
3. **Teardown:** N/A

---

## Methods

### `defaultSwordAnimation()`

**Description:** Creates sword animation component

**Flow:**
- Defines idle animation (single frame)
- Defines slashing animation (5-frame sequence)
- Returns animation component

**Side Effects:**
- None (pure function)

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `SWORD_STATE`: Defines animation states
  - `AnimationComponent`: Return type
- **Related Systems:**
  - `AnimationSystem`: Uses created animations
  - `SwordWeaponHandler`: Calls factory during entity creation
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!NOTE]  
> **Performance:** Frame indices must match loaded sprite textures exactly
