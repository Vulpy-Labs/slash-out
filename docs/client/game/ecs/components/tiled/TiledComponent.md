# Tiled Component Documentation

## Overview

The `TiledComponent` references loaded Tiled map data for tilemap entities. It provides access to map-specific assets like tilesets.

---

## Technical Identity

- **Type:** Component
- **Domain:** Tilemap Integration

---

## Responsibilities

- Tracks loaded tilesets for a map
- Provides reference to map-specific assets

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `tilesets`: Loaded tileset references

---

## Lifecycle & Execution Flow

1. **Initialization:** Created by `MapBuilder`
2. **Usage:** Referenced during tilemap rendering
3. **Teardown:** Removed with entity

---

## Methods

N/A (Pure data interface)

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Tilemaps.Tilemap`
- **Related Systems:**
  - `MapBuilder`: Creates component
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

N/A
