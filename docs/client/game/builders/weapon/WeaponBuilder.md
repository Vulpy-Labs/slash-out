# WeaponBuilder Documentation

## Overview

Factory for creating weapon entities through registered handlers.

---

## Technical Identity

- **Type:** Builder  
- **Domain:** Weapon Construction

---

## Responsibilities

- Manages weapon handler registry
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

### Constants Used

- `ENTITY_TYPES`: Defines weapon entity types

### Configuration Props

- `WeaponBuilderProp`:
- `WeaponEntityTypes`: Union type of supported weapon types
  - `scene: Phaser.Scene`
  - `onEntityCreated: OnEntityCreatedCallback`
- `WeaponBuilderBuildProp`:
  - `x: number`
  - `y: number`  
  - `ownerEntityId: string`
  - `entityType: WeaponEntityTypes`

---

## Lifecycle & Execution Flow

1. **Initialization:**
   - Creates handler map
   - Registers default handlers (Sword)
2. **Loading:**
   - Delegates to handler's load()
3. **Building:**
   - Delegates to handler's build()
   - Invokes onEntityCreated callback

---

## Methods

### `constructor({ scene, onEntityCreated })`

**Description:** Initializes builder

**Flow:**
- Stores scene reference
- Stores callback
- Initializes handler map
- Registers SwordWeaponHandler

### `load({ entityType })`

**Description:** Loads weapon assets

**Flow:**
- Gets handler by type
- Throws if not found
- Delegates to handler.load()

**Side Effects:**
- Loads assets via Phaser

### `build({ x, y, ownerEntityId, entityType })`

**Description:** Creates weapon entity

**Flow:**
- Gets handler by type
- Throws if not found
- Delegates to handler.build()
- Invokes callback with entity

**Side Effects:**
- Creates new entity
- Notifies EntityManager

---

## Dependencies & Relationships

- **Core Dependencies:**
  - `IWeaponHandler` interface
  - `SwordWeaponHandler` implementation
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
> **Positioning:** Weapons use owner's position + SWORD.CONFIG.OFFSET
