# SwordWeaponHandler Documentation

## Overview
Handles loading and building sword weapon entities in the game. Responsible for creating sword sprites with Matter.js physics and setting up their initial state.

## Technical Identity
- **Type:** Handler
- **Domain:** Weapon/Combat

## Responsibilities
- Loads sword sprite assets
- Creates sword entities with physics properties
- Configures sword display and collision properties
- Links swords to their owners via entity IDs

## Data Schema

### Manipulated Components
- **Writes:**
  - `StateComponent`: Sets initial sword state (IDLE)
  - `InputComponent`: Provides default input mapping
  - `KeymapComponent`: Configures key bindings based on owner
  - `AnimationComponent`: Sets up sword animations

### Configuration Props
- `load`:
  - `scene`: Phaser.Scene - Scene context for loading assets
- `build`:
  - `scene`: Phaser.Scene - Scene context for sprite creation
  - `x`: number - Initial x position
  - `y`: number - Initial y position
  - `ownerEntityId`: string - ID of entity owning this sword

## Lifecycle & Execution Flow
1. **Initialization:** Loads sprite assets via `load()`
2. **Build:** Creates Matter.js sprite with physics properties
3. **Runtime:** Maintains sword state and animation

## Methods

### `load({ scene }: { scene: Phaser.Scene }): void`
Loads sword sprite assets if they don't already exist in texture cache.

### `build({ scene, x, y, ownerEntityId }): GlobalEntity`
Creates and configures a sword entity with:
- Physics body
- Display properties
- Initial state
- Owner reference

## Dependencies & Relationships
- **Core Dependencies:** 
  - Phaser.Scene
  - Phaser.Physics.Matter.Sprite
  - MatterJS.BodyType
- **Related Systems:**
  - AnimationSystem: Handles sword animations
  - StateSystem: Manages sword state transitions

## Maintenance Notes
> [!WARNING]
> **Performance:** Uses sensor physics bodies for collision detection without physical interactions.
