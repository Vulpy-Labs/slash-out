# CollisionSystem Documentation: 

## Overview

The `CollisionSystem` manages collision detection and handling for all game entities. It uses Matter.js collision events and delegates specific collision handling to registered handlers based on entity types.

---

## Technical Identity

- **Type:** System
- **Domain:** Physics/Collision

---

## Responsibilities

- Registers Matter.js collision listeners
- Delegates collision handling to type-specific handlers
- Maintains mapping of entity types to collision handlers
- Provides handler registration interface

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A

### Configuration Props

- `CollisionSystemCreateProp` (`*.p.ts`):
  - `scene: Phaser.Scene`: Required for Matter.js event registration
  - `entities: GlobalEntityMap`: Contains all game entities for collision resolution

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Constructs with default handler mappings
   - Registers Matter.js collision listeners via `createMatterListeners()`

2. **Main Operations:**
   - Receives collision events from Matter.js
   - Delegates collision handling to appropriate handlers
   - Handles both sides of collision pairs

3. **Teardown:** N/A

---

## Methods

### `constructor()`

**Description:** Initializes system with default handlers

**Flow:**

- Creates handlers Map
- Registers `PlayerCollisionHandler` for `ENTITY_TYPES.PLAYER`

---

### `registerHandler({ entityType, handler })`

**Description:** Allows registration of custom collision handlers

**Flow:**

- Adds handler to internal Map
- Associates with specified entityType
- Can override default handlers for entity types

**Side Effects:**

- Modifies internal handlers Map

---

### `createMatterListeners({ scene, entities })`

**Description:** Registers Matter.js collision listeners

**Flow:**

- Attaches to Matter.js `collisionstart` event
- Delegates collision pairs to appropriate handlers

**Side Effects:**

- Registers Matter.js event listener

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Scene`: Required for Matter.js access
  - `MatterJS.BodyType`: Used for collision detection
  - `GlobalEntityMap`: Contains all game entities
  - `ICollisionSystemHandler`: Interface that handlers must implement
  - `ENTITY_TYPES`: Defines entity type constants
- **Related Systems:**
  - `PlayerCollisionHandler`: Default handler for player collisions

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Runs on every collision event. Keep handlers efficient.
> **Implementation:** All handlers must implement ICollisionSystemHandler interface
