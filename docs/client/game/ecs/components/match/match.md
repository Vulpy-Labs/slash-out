# Match Config Documentation

## Overview

The `MatchConfig` type defines all settings for a game match, including map selection and player configurations. It serves as the root configuration object passed to match initialization systems.

---

## Technical Identity

- **Type:** Configuration
- **Domain:** Match Setup

---

## Responsibilities

- Defines map selection
- Contains player configurations
- Provides match parameters to game systems

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `mapName`: Selected map identifier
- `players`: Player configurations

---

## Lifecycle & Execution Flow

1. **Initialization:** Created in `Preloader` scene
2. **Usage:** Passed to `EntityManager`
3. **Teardown:** Discarded after match start

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** `CharacterConfig`
- **Related Systems:**
  - `EntityManager`: Uses config to initialize match
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!NOTE]  
> **Validation:** `MapName` must match available map assets
