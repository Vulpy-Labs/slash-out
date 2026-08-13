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
  - `MatchConfig`
  - `MovementComponent`
  - `StateComponent`
  - `TiledComponent`
  - `VelocityComponent`
  - `WeaponComponent`
- **Writes:**
  - `AnimationComponent`
  - `InputComponent`
  - `KeymapComponent`
  - `MovementComponent`
  - `StateComponent`
  - `VelocityComponent`
  - `WeaponComponent`

### Configuration Props

- `MatchConfig`: Defines match parameters including map and players

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Receives `MatchConfig`
   - Initializes systems (Keymap, Input, Movement, Velocity, State, Weapon, Collision, Animation)
   - Initializes builders and managers
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

- `init(data: MatchConfig)`: Initializes match with configuration
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
  - Returns: `{ spawnPoints: MapSpawnPoint[] }`
- `createPlayers()`: Initializes player entities via EntityManager
  - Parameters: `spawnPoints: MapSpawnPoint[]`
- `createKeyboardInputs()`: Sets up key listeners via KeymapSystem
  - Parameters: `{ entities: GlobalEntityMap }`
- `createAnimations()`: Configures entity animations via AnimationSystem
  - Parameters: `{ entities: GlobalEntityMap }`
- `createCollisionListeners()`: Sets up Matter.js collision handlers
  - Parameters: `{ scene: Phaser.Scene, entities: GlobalEntityMap }`

---

### `update()`

**Description:** Runs ECS pipeline each frame

**Flow:**

1. Processes input
2. Handles movement
3. Updates velocities
4. Manages states
5. Updates weapons
6. Animates entities

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Scene`
  - `EntityManager`
  - `GlobalEntityMap` type
  - ECS Systems
  - `KeymapSystem`
- **Related Systems:**
  - `AnimationSystem`: Handles entity animations
  - `CollisionSystem`: Manages physics collisions
  - `InputSystem`: Processes player input
  - `KeymapSystem`: Maps keyboard inputs
  - `MovementSystem`: Handles entity movement
  - `StateSystem`: Manages entity states
  - `VelocitySystem`: Updates entity velocities
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
