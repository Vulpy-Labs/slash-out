# Default Player Animation Documentation

## Overview

The `defaultPlayerAnimation` factory creates an `AnimationComponent` for a character by mapping sprite model definitions into runtime animation keys.

---

## Technical Identity

- **Type:** Factory
- **Domain:** Animation

---

## Responsibilities

- Resolves animation definitions for a selected character
- Generates animation keys using character name, sprite name and skin
- Provides a safe fallback when sprite configuration is missing

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** `AnimationComponent`

### Configuration Props

- `MatchConfigCharacter`: source identity for character name and skin
- `CHARACTERS_SPRITES_MODEL`: source map for animation presets

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A (Stateless)
2. **Update Loop:** Called during entity/component assembly
3. **Teardown:** N/A (Stateless)

---

## Methods

### `defaultPlayerAnimation({ character }: DefaultPlayerAnimationProp): AnimationComponent`

**Description:** Builds animation state entries for the selected character and skin

**Flow:**

- Reads `CHARACTERS_SPRITES_MODEL[character.name]`
- Logs a warning and uses an empty list if config is missing
- Reduces animation presets into the `animations` map
- Creates each animation `key` as `${character.name}_${spriteName}_${character.skin}`
- Returns the assembled `AnimationComponent`

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `AnimationComponent`
  - `DefaultPlayerAnimationProp`
  - `CHARACTERS_SPRITES_MODEL`
- **Related Systems:**
  - `AnimationSystem`: consumes animation map to play character animations
  - `StateSystem`: indirectly affects which animation key is selected
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Asset Integrity:** Any mismatch between character names/skins and sprite model keys can produce empty animation maps and runtime animation gaps.
