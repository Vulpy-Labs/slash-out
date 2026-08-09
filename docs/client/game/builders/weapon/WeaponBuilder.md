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

### Configuration Props

- `WeaponBuilderProp`:
  - `scene: Phaser.Scene`
  - `onEntityCreated: (entity: GlobalEntity) => void`
- `WeaponBuilderBuildProp`:
  - `x: number`
  - `y: number`  
  - `ownerEntityId: string`
  - `entityType: WeaponEntityTypes`

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Creates handler map
   - Registers default handlers:
     - `ENTITY_TYPES.SWORD` mapped to `SwordWeaponHandler`
     - `ENTITY_TYPES.GUN` mapped to `GunWeaponHandler`
2. **Loading:**
   - Delegates to handler's load()
   - Throws error if handler not found
3. **Building:**
   - Delegates to handler's build()
   - Throws error if handler not found
   - Invokes onEntityCreated callback with built entity

---

## Methods

### `constructor({ scene, onEntityCreated })`

**Description:** Initializes builder with scene reference and entity creation callback

**Flow::
- Stores scene reference
- Stores callback
- Initializes handler map
- Registers SwordWeaponHandler and GunWeaponHandler

### `load({ entityType })`

**Description:** Loads weapon assets via registered handler

**Flow::
- Gets handler by type from map
- Throws error if handler not found
- Delegates to handler.load()

**Side Effects::
- Loads assets via Phaser's scene loader

### `build({ x, y, ownerEntityId, entityType })`

**Description:** Creates weapon entity via registered handler and initializes its components

**Flow::
- Gets handler by type from map
- Throws error if handler not found
- Delegates to handler.build()
- Invokes callback with created entity

**Side Effects::
- Creates new entity with physics body
- Notifies EntityManager via callback

### `private isValidWeapon(entity: GlobalEntity): entity is ValidWeaponEntity`

**Description:** Type guard for valid weapon entities

**Flow:**
1. Checks entity has required components
2. Verifies entity type is SWORD or GUN

**Side Effects:** N/A

---

## Dependencies & Relationships

- **Core Dependencies::
  - `IWeaponHandler` interface
  - `SwordWeaponHandler` implementation
  - `GunWeaponHandler` implementation
  - `GlobalEntity` type
- **Related Systems::
  - `EntityManager`: Receives created entities

---

## Maintenance Notes

> [!WARNING]  
> **Extensibility:** Add new handlers to constructor for new weapon types  
> **Error Handling:** Always validate handler exists before use
> **Physics:** Weapon sprites are created as sensors by default
