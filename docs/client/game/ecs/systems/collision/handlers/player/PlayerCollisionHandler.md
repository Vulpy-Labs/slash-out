# Player Collision Handler Documentation

## Overview

The `PlayerCollisionHandler` implements collision handling logic specific to player entities. It detects collisions with active enemy weapons and triggers player death state.

---

## Technical Identity

- **Type:** Handler
- **Domain:** Combat/Collision

---

## Responsibilities

- Detects valid player collisions
- Identifies active enemy weapons
- Updates player state on fatal collisions
- Maintains collision validation logic

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `StateComponent`: Checks weapon and player states
- **Writes:**
  - `StateComponent`: Updates player state on death

### Configuration Props

- `CollisionHandleProp` (`*.p.ts`):
  - `affected: GlobalEntity`: The entity being collided with
  - `collider: GlobalEntity`: The entity causing the collision
  - `entities: GlobalEntityMap`: Contains all game entities

---

## Lifecycle & Execution Flow

1. **Initialization:** N/A
2. **Main Operations:**
   - Validates collision participants
   - Checks weapon activation state
   - Updates player state if fatal collision detected
3. **Teardown:** N/A

---

## Methods

### `handle({ affected, collider })`

**Description:** Processes player collisions

**Flow:**

- Validates affected entity as player
- Checks if collider is active enemy weapon
- Updates player state to DEAD if fatal collision

**Side Effects:**

- Modifies player state component

---

### `private isActiveWeaponFromEnemy({ player, weapon })`

**Description:** Validates if weapon is active and from enemy

**Flow:**

- Checks weapon ownership
- Validates weapon activation state
- Returns true if active enemy weapon

---

### `private isValidPlayer(entity)`

**Description:** Type guard for valid player entities

**Flow:**

- Checks entity type
- Validates required components
- Returns true if valid player entity

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `ENTITY_TYPES`: Defines entity type constants
  - `CHARACTER_STATE`: Defines player state constants
  - `SWORD_STATE`: Defines sword state constants
  - `GUN_STATE`: Defines gun state constants
- **Related Systems:**
  - `CollisionSystem`: Delegates player collisions to this handler

---

## Maintenance Notes

> [!WARNING]  
> **Logic:** Must maintain strict validation of collision participants
