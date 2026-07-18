# Character Component Documentation

## Overview

The `CharacterComponent` stores runtime data about game characters, including their visual appearance and identification. It references the configured skins and names from `CHARACTER_SKINS` and `CHARACTER_NAMES` constants.

---

## Technical Identity

- **Type:** Component
- **Domain:** Character Data

---

## Responsibilities

- Tracks character skin and name during gameplay
- Provides identification for character-specific systems like animation

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `skin` (`CHARACTER_SKINS`): Currently equipped visual appearance
- `name` (`CHARACTER_NAMES`): Character identifier

---

## Lifecycle & Execution Flow

1. **Initialization:** Created by PlayerBuilder from CharacterConfig
2. **Usage:** Referenced by AnimationSystem for sprite selection
3. **Teardown:** Removed when entity is destroyed

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** `CHARACTER_SKINS`, `CHARACTER_NAMES`
- **Related Systems:**
  - `AnimationSystem`: Uses skin/name for sprite selection
  - `StateSystem`: May reference name for character-specific states
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Type Safety:** Always use the exported `CHARACTER_SKINS`/`NAMES` types when modifying these fields.
