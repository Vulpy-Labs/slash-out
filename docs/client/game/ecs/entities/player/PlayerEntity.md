# Player Entity Documentation

## Overview

The `PlayerEntity` defines the complete component structure for player entities, including all necessary components for player functionality like input, movement and animation.

---

## Technical Identity

- **Type:** Entity
- **Domain:** Player

---

## Data Schema

### Properties

- **keymap**: Keyboard configuration mapping
- **input**: Current input state tracking
- **movement**: Movement physics and state
- **character**: Identity and visual properties
- **animation**: Animation configuration
- **state**: Current state
- **sprite**: Required MatterJS physics sprite

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `BaseEntity`
  - `InputComponent`
  - `KeymapComponent`
  - `StateComponent`
  - `MovementComponent`
  - `AnimationComponent`
  - `CharacterComponent`
  - `Phaser.Physics.Matter.Sprite`

---

## Maintenance Notes

N/A
