# State System Documentation

## Overview

The `StateSystem` manages entity state transitions using registered state handlers. Implements a finite state machine pattern for entities.

---

## Technical Identity

- **Type:** System
- **Domain:** State Management

---

## Responsibilities

- Handles state transitions for registered entity types
- Delegates state-specific logic to handler classes

---

## Data Schema

### Manipulated Components

- **Writes:**
  - `StateComponent`: Updates current state based on handler logic

### Configuration Props

- `StateSystemUpdateProp` (`*.p.ts`): Iterates through entities to update
- Initializes with:
  - Built-in handlers:
    - `ENTITY_TYPES.PLAYER`: `PlayerStateHandler`
    - `ENTITY_TYPES.SWORD`: `SwordStateHandler`
    - `ENTITY_TYPES.GUN`: `GunStateHandler`
  - Adding new handlers:
    1. Implement `IEntityStateHandler` interface
    2. Register in constructor via `this.handlers.set()`
    3. Handler must implement `update()` method
  - Current limitations:
    - No handler fallback mechanism

---

## Lifecycle & Execution Flow

1. **Initialization:** Creates handler map with default handlers
2. **Update Loop:** Processes state changes each frame
3. **Teardown:** N/A (handlers are stateless)

---

## Methods

### `update({ entities }: StateSystemUpdateProp): void`

**Description:** Updates entity states using registered handlers

**Flow:**

- Iterates through all entities with `forEach`
- For each entity:
  - Skips if entity lacks `state` component
  - Gets handler using `entity.entityType` as Map key
  - Calls handler's `update({ entity, entities })` if handler exists
  - Handler receives entity with all components
- Skipped if:
  - No `StateComponent` present

**Side Effects:**

- Modifies entity state components
- Triggers state transition logic

---

## Dependencies & Relationships

- **Core Dependencies:** 
  - `ENTITY_TYPES`: Entity type constants
  - `IEntityStateHandler`: Interface for state handlers
- **Related Systems:**
  - `AnimationSystem`: Reacts to state changes
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Fallback:** Entities without registered handlers will be silently skipped  
> **Extensibility:** New entity types require implementing `IEntityStateHandler` and registering in constructor  
