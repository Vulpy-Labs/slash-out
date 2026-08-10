# Default Bullet Animation Documentation

## Overview

The `defaultBulletAnimation` factory function creates an `AnimationComponent` configuration for bullet entities. It defines animations for different gun states (IDLE, FIRING, IN_FLIGHT).

---

## Technical Identity

- **Type:** Factory
- **Domain:** Animation

---

## Responsibilities

- Provides standard animation configurations for bullet entities
- Maps gun states to specific animation frames
- Defines animation timing and looping behavior

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

N/A (Pure function with no parameters)

---

## Lifecycle & Execution Flow

1. **Initialization:** Called during entity creation
2. **Update:** N/A
3. **Teardown:** N/A

---

## Methods

### `defaultBulletAnimation(): AnimationComponent`

**Description:** Creates animation configuration for bullet entities

**Flow:**

1. Defines IDLE animation (single frame)
2. Defines FIRING animation (two frames)
3. Defines IN_FLIGHT animation (two frames)

**Side Effects:**

- None (Pure function)

---

## Dependencies & Relationships

- **Core Dependencies:** 
  - `GUN_STATE`: State constants for gun animations
  - `AnimationComponent`: Return type interface
- **Related Systems:**
  - `AnimationSystem`: Uses the created animation configurations
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!NOTE]  
> **Consistency:** Ensure animation frame keys match loaded texture atlas names
> **Performance:** Frame rates are optimized for smooth bullet animations
