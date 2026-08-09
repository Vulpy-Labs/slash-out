# WeaponBuilder Documentation

## Overview

Factory for creating weapon entities through registered handlers.

---

## Technical Identity

- **Type:** Builder (Entity Factory)  
- **Domain:** Weapon Construction

---

## Responsibilities

- Manages weapon handler registry
- Maintains handler registry lifecycle
- Delegates loading to handlers
- Delegates building to handlers
- Notifies EntityManager of new entities

---

## Data Schema

### Manipulated Components

- **Reads:** N/A
- **Writes:** N/A
- **Creates:**
  - `GlobalEntity` via handlers
  - Weapon sprites with Matter.js physics
  - Weapon state components
  - Input components
  - Keymap bindings
  - Animation components

### Constants Used

- `ENTITY_TYPES`: Defines weapon entity types (currently `SWORD` and `GUN` supported)
- `GlobalEntityMap`: Type for entity collection used in handlers

### Configuration Props

- `WeaponEntityTypes`: Union type of supported weapon entity types (`ENTITY_TYPES.SWORD | ENTITY_TYPES.GUN`)
- `WeaponBuilderProp`:
  - `scene: Phaser.Scene`
  - `onEntityCreated: (entity: GlobalEntity) => void`
- `WeaponBuilderBuildProp`:
  - `x: number`
  - `y: number`  
  - `ownerEntityId: string`
  - `entityType: WeaponEntityTypes` (`ENTITY_TYPES.SWORD` or `ENTITY_TYPES.GUN`)

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Creates handler map
   - Registers default handlers:
     - `ENTITY_TYPES.SWORD` mapped to `SwordWeaponHandler`
     - `ENTITY_TYPES.GUN` mapped to `GunWeaponHandler`
2. **Loading:**
   - Delegates to handler's load()
   - Throws error if handler not found: `No weapon builder handler found for entity type: ${entityType}`
3. **Building:**
   - Delegates to handler's build()
   - Throws error if handler not found: `No weapon builder handler found for entity type: ${entityType}`
   - Invokes onEntityCreated callback with built entity
4. **Handler Management:**
   - Maintains handler instances in memory
   - Ensures handlers are properly initialized

---

## Methods

### `constructor({ scene, onEntityCreated })`

**Description:** Initializes builder with scene reference and entity creation callback

**Flow:**
- Stores scene reference
- Stores callback
- Initializes handler map
- Registers SwordWeaponHandler and GunWeaponHandler

### `load({ entityType })`

**Description:** Loads weapon assets via registered handler

**Flow:**
- Gets handler by type from map
- Throws error if handler not found
- Delegates to handler.load()

**Side Effects:**
- Loads assets via Phaser's scene loader

### `build({ x, y, ownerEntityId, entityType })`

**Description:** Creates weapon entity via registered handler and initializes its components

**Flow:**
- Gets handler by type from map
- Throws error if handler not found
- Delegates to handler.build()
- Invokes callback with created entity

**Side Effects:**
- Creates new entity with physics body
- Notifies EntityManager via callback

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `IWeaponHandler` interface (load/build methods)
  - `GlobalEntityMap` type for entity collections
  - `SwordWeaponHandler` implementation
  - `GunWeaponHandler` implementation
  - `GlobalEntity` type
  - `WeaponBuilderProp` and `WeaponBuilderBuildProp` types
- **Related Systems:**
  - `EntityManager`: Receives created entities
  - `AnimationSystem`: Handles weapon animations
- **Events Consumed/Emitted:** N/A

---

## Maintenance Notes

> [!WARNING]  
> **Extensibility:** Add new handlers to constructor for new weapon types  
> **Error Handling:** Always validate handler exists before use
> **Physics:** Weapon sprites are created as sensors by default
> **Positioning:** Weapons use owner's position + weapon-specific offsets
> **Type Safety:** Only `ENTITY_TYPES.SWORD` and `ENTITY_TYPES.GUN` are currently supported as WeaponEntityTypes
> **Memory Management:** Handlers are kept in memory indefinitely. Consider cleanup strategy if adding many handlers

> [!NOTE]  
> **Handler Registry:** Handlers are stored in a Map for efficient lookup by weapon type  
> **Weapon Types:** Currently only supports `ENTITY_TYPES.SWORD` and `ENTITY_TYPES.GUN`
