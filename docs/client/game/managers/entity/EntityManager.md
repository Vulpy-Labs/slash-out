# Entity Manager Documentation

## Overview

The `EntityManager` is the single source of truth for all game entities, enforcing strict ECS lifecycle management through builders. It maintains separate registries for all entities and player entities specifically, ensuring compliance with EntityManager is the Law golden rule.

---

## Technical Identity

- **Type:** Manager
- **Domain:** Entity Lifecycle

---

## Responsibilities

- Serves as central registry for all game entities
- Creates player entities through `PlayerBuilder`
- Manages complete entity lifecycle (creation to destruction)
- Enforces proper cleanup of Phaser sprites and Matter.js bodies
- Generates unique player IDs
- Provides access to entity maps
- Ensures entities are only created/destroyed through proper ECS channels
- Maintains separation between player and non-player entities

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `MatchConfig`: Reads player character configurations
- **Writes:** N/A

### Configuration Props

- `EntityManagerProp` (`*.p.ts`):
  - `scene: Phaser.Scene`: Required for builder construction
  - `matchConfig: MatchConfig`: Contains player character definitions

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Constructs with scene and `matchConfig` references
   - Initializes `PlayerBuilder` with creation callback
   - Loads player assets via `PlayerBuilder.load()`

2. **Main Operations:**
   - Creates player entities from `matchConfig` via `PlayerBuilder.build()`
   - Registers entities through `registerEntity()`
   - Destroys entities via `destroyEntity()` including sprite cleanup

3. **Teardown:**
   - Ensures all entities are properly destroyed
   - Clears all internal entity references

---

## Methods

### `load()`

**Description:** Preloads all required assets

**Flow:**

- Calls `loadPlayers()`
- Delegates to `PlayerBuilder.load()` for each character

**Side Effects:**

- Loads character assets via Phaser loader

---

### `createPlayers()`

**Description:** Instantiates player entities from match configuration

**Flow:**

- Iterates `matchConfig.players.characters`
- Delegates to `PlayerBuilder.build()` for each character
- Uses `registerEntity()` callback for player registration

**Side Effects:**

- Populates players Map
- Initializes player sprites via builder

---

### `getAll(): GlobalEntityMap`

**Description:** Returns Map of all registered entities

**Side Effects:**

- N/A (returns reference)

---

### `getPlayers(): GlobalEntityMap`

**Description:** Returns Map of all player entities

**Side Effects:**

- N/A (returns reference)

---

### `destroyEntity({ id }: DestroyEntityProp)`

**Description:** Properly destroys an entity and cleans up resources

**Flow:**

- Finds entity by ID
- Destroys Phaser sprite if exists
- Removes from both entity maps
- Frees up player ID if applicable

**Side Effects:**

- Removes entity references
- Performs Phaser cleanup

---

### `private initializeInstances()`

**Description:** Initializes all required builder instances

**Flow:**

- Calls `initializeBuilders()`

---

### `private initializeBuilders()`

**Description:** Creates and configures builder instances

**Flow:**

- Instantiates `PlayerBuilder`
- Configures `PlayerBuilder`'s `onEntityCreated` callback

**Side Effects:**

- Creates `PlayerBuilder` instance

---

### `private loadPlayers()`

**Description:** Preloads assets for all player characters

**Flow:**

- Iterates `matchConfig.players.characters`
- Delegates to `PlayerBuilder.load()` for each

**Side Effects:**

- Loads character assets via Phaser loader

---

### `private createPlayerId()`

**Description:** Generates unique player IDs

**Flow:**

- Checks existing player IDs
- Generates sequential ID (`player_01`, `player_02`, etc.)
- Ensures no duplicate IDs exist

**Side Effects:**

- Maintains unique player ID sequence

---

### `private registerEntity({ entity, options }: RegisterEntityProp)`

**Description:** Registers an entity in the appropriate registry

**Flow:**

- Checks `options.isPlayer` flag
- Generates player ID if needed via `createPlayerId()`
- Adds to entities Map
- Adds to players Map if `isPlayer`

**Side Effects:**

- Modifies entities and players Maps
- May assign `entity.entityId`

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `Phaser.Scene`: Required for sprite management
  - `PlayerBuilder`: Handles player entity construction
  - `MatchConfig`: Provides player character definitions
- **Related Systems:**
  - `PlayerBuilder`: For player entity creation
  - `WeaponBuilder`: For weapon entity creation

---

## Maintenance Notes

> [!WARNING]  
> **Memory:** `destroyEntity()` must be called whenever removing entities to:
>
> - Destroy Phaser sprites
> - Remove from both players and entities Maps
