# All Components List Documentation

## Overview

The `AllComponentsList` interface defines the complete typing structure for all available ECS components. It serves as the central union type for entity definitions.

---

## Technical Identity

- **Type:** Component
- **Domain:** ECS Architecture

---

## Responsibilities

- Provides unified typing for entities
- Documents all available component types
- Enforces type safety across ECS

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `AnimationComponent`
  - `CharacterComponent`
  - `InputComponent`
  - `KeymapComponent`
  - `MatchConfig`
  - `MovementComponent`
  - `StateComponent`
  - `VelocityComponent`
- **Writes:** N/A

### Configuration Props

- `matchConfig`: Match settings
- `keymap`: Input bindings
- `input`: Active inputs
- `movement`: Movement physics
- `velocity`: Current velocity
- `character`: Character attributes
- `animation`: Animations
- `state`: Current state

---

## Lifecycle & Execution Flow

1. **Usage:** Referenced by entity definitions
2. **Validation:** Used for type checking

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `AnimationComponent`
  - `CharacterComponent`
  - `InputComponent`
  - `KeymapComponent`
  - `MatchConfig`
  - `MovementComponent`
  - `StateComponent`
  - `VelocityComponent`
- **Related Systems:**
  - All systems reference these types
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Consistency:** Must stay in sync with all component definitions
