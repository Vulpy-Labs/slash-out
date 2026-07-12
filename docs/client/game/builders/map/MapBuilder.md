# Map Builder Documentation

## Overview

The `MapBuilder` is responsible for loading and constructing tile-based maps using Tiled JSON data. It handles map layers, collision setup, spawn points, and custom properties extraction.

---

## Technical Identity

- **Type:** Builder
- **Domain:** Map

---

## Responsibilities

- Loading Tiled map JSON and associated sprites
- Creating map layers with proper depth ordering
- Setting up collision for platform layers
- Extracting spawn points from object layers
- Retrieving custom properties from the map

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `TiledComponent`: For tileset information during sprite loading
- **Writes:**
  - `TiledComponent`: Extracts tileset data during sprite loading

### Configuration Props

- `MapBuilderProp` (`*.p.ts`): Contains scene reference and map name
- `CreateMapLayerProp` (`*.p.ts`): Specifies layer group and tilesets for layer creation
- `SetLayerDepthProp` (`*.p.ts`): Defines layer group and layer for depth assignment

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Receives scene and map name in constructor
2. **Loading Phase:**
   - Loads Tiled map JSON
   - Loads required sprites from tilesets
3. **Building Phase:**
   - Creates map instance with loaded JSON
   - Validates and registers tilesets
   - Builds layers in order:
     - Background (depth: BACKGROUND)
     - Ground (depth: GROUND, with platform collision)
     - Foreground (depth: FOREGROUND)
   - Processes 'objects/spawnpoint' layer
   - Extracts custom properties from map definition
4. **Output:**
   - Returns map instance, custom properties, and spawn points

---

## Methods

### `load()`

**Description:** Loads map JSON and associated sprites

**Flow:**

- Loads Tiled map JSON file
- Sets up sprite loading for tilesets

**Side Effects:**

- Adds assets to Phaser's loader queue

### `build()`

**Description:** Constructs the map and its components

**Flow:**

- Validates map tilesets exist
- Creates tilemap instance with loaded JSON
- Builds map layers (background, ground, foreground)
- Configures collision via Matter.js for platform layers
- Extracts spawn points from 'objects/spawnpoint' layer
- Falls back to default spawn if missing layer
- Retrieves custom properties from map definition

**Side Effects:**

- Creates Matter.js collision bodies
- Adds layers to Phaser scene
- Configures physics collision via Matter.js conversion

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Scene`, `Phaser.Tilemaps.Tilemap`
- **Related Systems:** N/A
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Map building occurs during scene initialization. Avoid heavy operations in the build phase.

> [!NOTE]  
> **Layer Processing:** Layer creation scales with map complexity. Simple maps process quickly while complex maps may cause frame spikes during initialization.
