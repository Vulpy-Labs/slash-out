# Player Builder Documentation

## Overview

The `PlayerBuilder` handles the creation and setup of player entities, including sprite loading, entity composition, and Matter.js physics configuration.

---

## Technical Identity

- **Type:** Builder
- **Domain:** Player Entity Creation

---

## Responsibilities

- Loading character spritesheets based on `CHARACTERS_SPRITES_MODEL`
- Creating Matter.js physics sprites with fixed rotation
- Composing player entities with default ECS components
- Tracking sprite loading state to prevent duplicate loads
- Handling sprite loading completion events

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `CharacterComponent`: For character name and skin configuration
- **Writes:** N/A
- **Creates:**
  - `AnimationComponent`: For setting up default player animations

### Constants Used

- `CHARACTERS_SPRITES_MODEL`: Defines sprite configurations per character
- `PLAYER_DIMENSIONS`: Specifies sprite frame dimensions
- `DEPTH`: Controls entity rendering depth (ENTITIES layer)
- `ENTITY_TYPES`: Identifies entity type ('PLAYER')

### Configuration Props

- `PlayerBuilderProp` (`*.p.ts`): Contains scene reference and entity creation callback
- `PlayerBuilderPayloadProp` (`*.p.ts`): Specifies character configuration
- `CreatePlayerSpriteProp` (`*.p.ts`): Defines character, frame, and physics options for sprite creation
- `MountPlayerEntityProp` (`*.p.ts`): Specifies character and sprite for entity composition
- `DefaultPlayerAnimationProp` (`*.p.ts`): Configures idle animations using character reference from MatchConfigCharacter

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Receives scene and callback in constructor
2. **Loading Phase:**
   - Loads character spritesheets based on configuration
3. **Building Phase:**
   - Creates Matter.js sprite
   - Composes player entity with components
4. **Callback:**
   - Invokes `onEntityCreated` callback with built entity

---

## Methods

### `load({ character })`

**Description:** Loads required spritesheets for the character

**Flow:**

- Validates character sprite model exists in `CHARACTERS_SPRITES_MODEL`
- Generates texture keys in format: `<name>_<sprite>_<skin>`
- Skips if texture already exists in scene
- Prevents duplicate loads via `loadingSpritesKeys` tracking
- Configures spritesheet with `PLAYER_DIMENSIONS`
- Cleans up loading state on 'filecomplete-spritesheet-\*' event

**Side Effects:**

- Adds assets to Phaser's loader queue
- Maintains `loadingSpritesKeys` Set for tracking

### `build({ character })`

**Description:** Creates player entity and sprite

**Flow:**

- Creates Matter.js sprite with fixed rotation
- Sets sprite depth based on `DEPTH` constant
- Composes entity with default ECS components:
  - Input
  - State
  - Animation
  - Movement
  - Keymap
- Invokes `onEntityCreated` callback

### `mountPlayerEntity({ character, sprite })`

**Description:** Composes player entity with default components

**Flow:**

- Creates base entity structure with empty `entityId`
- Sets `entityType` to 'PLAYER'
- Merges default components:
  - keymap: Binds to playerRef
  - input: Initializes action tracking
  - movement: Configures physics
  - animation: Creates state-based animation definitions
  - state: Initial mobility state
  - character: References name and skin

**Side Effects:**

- Returns new entity instance
- Requires `EntityManager` to set `entityId`
- Adds Matter.js physics body to world
- Creates new entity instance
- Registers entity with `EntityManager` (via callback)

---

## Dependencies & Relationships

- **Core Dependencies:** `Phaser.Scene`, `Phaser.Physics.Matter.Sprite`
- **Related Systems:** N/A
- **Events Consumed/Emitted:**
  - `filecomplete-spritesheet-*`: Tracks sprite loading completion

---

## Maintenance Notes

> [!WARNING]  
> **Performance:**
>
> - Sprite loading occurs during scene initialization
> - Uses Set to track loading state for async safety
> - Validates texture existence before loading

> [!NOTE]  
> **Temporary:**
>
> - Uses hardcoded spawn points until respawn system is implemented
> - Entity ID is set by `EntityManager` after creation
