# Character Config Documentation

## Overview

The `CharacterConfig` type defines player character configurations for matches. It specifies which character skins and names are assigned to each player slot.

---

## Technical Identity

- **Type:** Configuration
- **Domain:** Match Setup

---

## Responsibilities

- Defines character selections per player
- Provides reference data for character initialization

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `playerRef`: Player identifier ('01' or '02')
- `name`: Selected character name
- `skin`: Selected character skin

---

## Lifecycle & Execution Flow

1. **Initialization:** Created in match config
2. **Usage:** Passed to `PlayerBuilder`
3. **Teardown:** Discarded after match setup

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** `CharacterComponent`
- **Related Systems:**
  - `PlayerBuilder`: Creates entities from config
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!NOTE]  
> **Validation:** Ensure `playerRef` matches slot numbering
