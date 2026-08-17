# CollisionSystem Documentation

## Overview

The `CollisionSystem` handles collision detection and response between entities using Matter.js physics engine.

---

## Technical Identity

- **Type:** System
- **Domain:** Physics/Collision

---

## Responsibilities

- Registering collision handlers for specific entity types
- Creating Matter.js collision listeners
- Delegating collision events to appropriate handlers

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `EntityType`: Determines which handler to use
- **Writes:** 
  - N/A (Handlers may modify components)

### Configuration Props

- `CollisionSystemCreateProp`: 
  - `scene: Phaser.Scene`: Scene containing Matter.js world
  - `entities: GlobalEntityMap`: Map of all entities

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Creates empty handler map
2. **Registration:**
   - Handlers registered via `registerHandler`
3. **Execution:**
   - Creates Matter.js collision listeners
   - Delegates collision events to registered handlers

---

## Methods

### `registerHandler({ entityType, handler })`

**Description:** Registers collision handler for specific entity type

**Parameters:**
- `entityType: EntityTypes`: Entity type to handle
- `handler: ICollisionSystemHandler`: Handler implementation

**Side Effects:**
- Adds handler to internal map

---

### `createMatterListeners({ scene, entities })`

**Description:** Creates Matter.js collision listeners

**Parameters:**
- `scene: Phaser.Scene`: Scene containing Matter.js world
- `entities: GlobalEntityMap`: Map of all entities

**Flow:**
1. Listens for 'collisionstart' events
2. For each collision pair:
   - Gets entities from body labels
   - Delegates to appropriate handlers

**Side Effects:**
- Adds Matter.js event listener

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `MatterJS.BodyType`
  - `EntityTypes`
  - `GlobalEntityMap`
- **Related Systems:**
  - N/A
- **Events Consumed/Emitted:**
  - `collisionstart`: Matter.js collision event

---

## Maintenance Notes

> [!WARNING]
> **Performance:** Runs on every collision event. Keep handlers lightweight.
> **Architecture:** Handlers must implement `ICollisionSystemHandler` interface.
