# Sword Weapon System Handler Documentation

## Overview

Handles the visual representation and positioning of sword weapons during combat. Manages sword visibility, depth, and positioning relative to the character during different attack states.

---

## Technical Identity

- **Type:** System Handler  
- **Domain:** Weapon/Combat  

---

## Responsibilities

- Controls sword visibility based on attack state
- Positions sword sprite relative to character during attacks
- Manages sword depth rendering
- Handles sword angle/rotation during different attack directions

---

## Data Schema

### Manipulated Components

- **Reads:**
  - `ValidSwordWeaponEntity`: Type guard for sword entities
  - `StateComponent`: Checks current sword state (SLASHING/IDLE)
  - `InputComponent`: Determines attack direction (up/down)
  - `AnimationComponent`: Syncs flip state with character
  - `ownerEntityId`: Used to find owning character entity
- **Writes:**
  - Sprite properties: Updates position, visibility, depth, angle
  - `AnimationComponent`: Updates flipX state

### Configuration Props

- `SwordWeaponSystemHandlerUpdateProp`: Contains `entity` and `entities` parameters for update
- `SWORD.CONFIG.OFFSET`: Determines sword positioning offset from character
- `SWORD.CONFIG.WIDTH`: Defines sword physics body width
- `SWORD.CONFIG.HEIGHT`: Defines sword physics body height
- `DEPTH.ENTITIES`: Used for proper z-index layering

---

## Lifecycle & Execution Flow

1. **Initialization:** Creates transform target object for positioning calculations
2. **Update Loop:** 
   - Checks sword state
   - Shows/positions or hides sword based on state
   - Calculates proper offsets and angles
3. **Teardown:** N/A (stateless handler)

---

## Methods

### `update({ entity, entities }: SwordWeaponSystemHandlerUpdateProp): void`

**Description:** Main update method called each frame to handle sword state

**Flow:**
- Validates entity is a sword
- Routes to show/hide logic based on state
- Delegates positioning calculations

**Side Effects:**
- Modifies sprite visibility and position
- Updates animation flip state

### `private showAndPositionSword({ entity, entities }): void`

**Description:** Handles visible sword state

**Flow:**
- Makes sprite visible
- Sets proper depth
- Finds owner entity
- Calculates position relative to owner

**Side Effects:**
- Modifies sprite properties

### `private updateTransform({ sword, owner }): void`

**Description:** Calculates and applies sword positioning

**Flow:**
- Checks owner flip state
- Calculates offsets based on attack direction (up/down/neutral)
- Adjusts angle for vertical attacks (90° up/down)
- Maintains horizontal offset for neutral attacks
- Syncs flip state with owner character
- Applies final position, angle and flip to sprite

**Side Effects:**
- Updates sprite transform properties

### `private populateOffsetAndAngle({ ownerState, ownerInput, isFlipped }): void`

**Description:** Determines sword positioning offsets

**Flow:**
- Checks for up/down attack inputs
- Calculates appropriate offsets and angles
- Stores results in transform target

**Side Effects:**
- Updates internal transform target object

### `private hideSword({ entity }): void`

**Description:** Handles hidden sword state

**Flow:**
- Hides sprite
- Resets depth and angle
- Moves offscreen

**Side Effects:**
- Modifies sprite properties

### `private isValidSword(entity): boolean`

**Description:** Type guard for sword entities

**Flow:**
- Checks for required components
- Verifies entity type

---

## Dependencies & Relationships

- **Core Dependencies:** 
  - Phaser.Physics.Matter.Sprite
  - `GlobalEntityMap` type for entity collections
  - `IWeaponSystemHandler` interface
  - SWORD_STATE constants
  - CHARACTER_STATE constants
  - ENTITY_TYPES.SWORD
  - GlobalEntity type
- **Related Systems:**
  - SwordStateHandler: Determines sword state
  - AnimationSystem: Handles sprite animations
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Performance:** Runs in update loop. Avoid adding allocations - transform target is reused.

> [!NOTE]  
> **Positioning:** Sword offset is relative to character sprite center point. Adjust SWORD.CONFIG.OFFSET for different weapon lengths.
