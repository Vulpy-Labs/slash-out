# Match Scene Documentation

## Overview

The `MatchScene` is the core gameplay scene that initializes and manages the ECS systems, entities, and world state for a game match.

---

## Technical Identity

- **Type:** Scene
- **Domain:** Gameplay Management

---

## Responsibilities

- Initializing all ECS systems and managers
- Building game world and entities
- Running the main game loop
- Managing entity lifecycle via `EntityManager`

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `AnimationComponent`
  - `CharacterComponent`
  - `InputComponent`
  - `KeymapComponent`
  - `MovementComponent`
  - `StateComponent`
  - `VelocityComponent`
- **Writes:**
  - `AnimationComponent`
  - `InputComponent`
  - `KeymapComponent`
  - `MovementComponent`
  - `StateComponent`
  - `VelocityComponent`

### Configuration Props

- `MatchConfig`: Defines match parameters including map and players

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Receives `MatchConfig`
   - Initializes systems, builders, and managers
2. **Preloading:**
   - Loads map and entity assets
3. **Creation:**
   - Builds world and entities
   - Sets up input and animations
4. **Update Loop:**
   - Runs ECS pipeline

---

## Methods

### System Initializers

- `initializeInstances()`: Initializes all instances
- `initializeSystems()`: Creates all ECS systems in proper order
- `initializeBuilders()`: Initializes world builders (e.g. `MapBuilder`)
- `initializeManagers()`: Creates `EntityManager` instance
- `initializeEntities()`: Sets all entities

---

### Loading Methods

- `preload()`: Loads map and entities assets

---

### Creation Methods

- `create()`: Creates game world and entities
- `createMap()`: Builds game world via `MapBuilder`
- `createPlayers()`: Initializes player entities
- `createKeyboardInputs()`: Sets up key listeners
- `createAnimations()`: Configures entity animations

---

### `update()`

**Description:** Runs ECS pipeline each frame

**Flow:**

1. Processes input
2. Handles movement
3. Updates velocities
4. Manages states
5. Animates entities

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Scene`
  - `EntityManager`
  - `GlobalEntityMap` type
  - ECS Systems
- **Related Systems:**
  - All ECS systems in defined order
  - `WeaponSystem`: Manages weapon behaviors
- **Builders:**
  - `MapBuilder`: Constructs game world
- **Managers:**
  - `EntityManager`: Handles entity lifecycle

---

## Maintenance Notes

> [!WARNING]
>
> **Performance:** The update loop runs every frame  
> **Architecture:** Never bypass `EntityManager` for entity operations
